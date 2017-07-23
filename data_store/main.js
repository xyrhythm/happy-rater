const events = require('events');
const mysql = require('mysql');

const eventEmitter = new events.EventEmitter();

const con = mysql.createConnection({
  host: 'rater-dev.cwvjfre1hpn6.us-west-1.rds.amazonaws.com',
  port: 3306,
  user: 'ratermaster',
  // TODO(gillwang): find a way to solve the password leak issue of mysql.
  password: '',
  database: 'happyrater'
});

con.connect(function(err) {
  if (err) throw err;
  console.log('Connected!');
});

const querySql = function(sql) {
  con.query(sql, function(err, result) {
    if (err) throw err;
    console.log('Inserted one entry.');
  });
};

// TODO(fenghaolw): All of these should support batch updates.
// entry is a ES6 Map
const InsertEntry = function(table_name, entry) {
  // Print the entry for debugging
  console.log(entry);
  const fields = Array.from(entry.keys()).join(',');
  const values = Array.from(entry.values()).join(',');
  querySql(`INSERT INTO ${table_name} (${fields}) VALUES (${values});`);
};

const AddTask = function(type) {
  const entry = new Map();
  entry.set('type', type);
  InsertEntry('task', entry);
};

const AddRater = function(rater_id, first_name, last_name) {
  const entry = new Map();
  entry.set('id', rater_id);
  entry.set('first_name', `'${first_name}'`);
  entry.set('last_name', `'${last_name}'`);
  InsertEntry('rater', entry);
};

const AddQuestion = function(question_id, description, image_url, task_id) {
  const entry = new Map();
  entry.set('id', question_id);
  entry.set('task_id', task_id);
  entry.set('description', `'${description}'`);
  entry.set('image_url', `'${image_url}'`);
  InsertEntry('question', entry);
};

const AddRecord = function(record_id, rater_id, question_id, response) {
  const entry = new Map();
  entry.set('id', record_id);
  entry.set('rater_id', rater_id);
  entry.set('question_id', question_id);
  entry.set('response', `'${response}'`);
  InsertEntry('record', entry);
};

eventEmitter.on('AddTask', AddTask);
eventEmitter.on('AddRater', AddRater);
eventEmitter.on('AddQuestion', AddQuestion);
eventEmitter.on('AddRecord', AddRecord);
