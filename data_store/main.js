const events = require('events');
const mysql = require('mysql');

const eventEmitter = new events.EventEmitter();

const con = mysql.createConnection({
  host: 'rater-dev.cwvjfre1hpn6.us-west-1.rds.amazonaws.com',
  port: 3306,
  user: 'ratermaster',
  // TODO(gillwang): find a way to solve the password leak issue of mysql.
  password: '',
  database: 'happyrater',
});

con.connect(function(err) {
  if (err) {
    throw err;
  }
  console.log('Connected!');
});

function querySql(sql, msg) {
  con.query(sql, function(err, result) {
    if (err) {
      throw err;
    }
    if (msg) {
      console.log(msg);
    }
    console.log(result);
  });
}

// TODO(fenghaolw): All of these should support batch updates.
// entry is a ES6 Map
function insertEntry(tableName, entry) {
  // Print the entry for debugging
  console.log(entry);
  const fields = Array.from(entry.keys()).join(',');
  const values = Array.from(entry.values()).join(',');
  querySql(`INSERT INTO ${tableName} (${fields}) VALUES (${values});`,
    'Inserted one entry.');
}

function addRater(id, account, nickname) {
  const entry = new Map();
  entry.set('rater_id', id);
  entry.set('rater_account', `'${account}'`);
  entry.set('rater_nickname', `'${nickname}'`);
  insertEntry('rater', entry);
}

function addRequester(id, account) {
  const entry = new Map();
  entry.set('requester_id', id);
  entry.set('requester_account', `'${account}'`);
  insertEntry('requester', entry);
}

function addTask(id, requesterId, name, type, instruction, question,
  answer, timestamp) {
  const entry = new Map();
  entry.set('task_id', id);
  entry.set('task_requester_id', requesterId);
  entry.set('task_name', name);
  // TODO(fenghaolw): type is a enum. Check if any special handling is required.
  entry.set('task_type', type);
  entry.set('task_instruction', instruction);
  entry.set('task_question_string', question);
  entry.set('task_answer_options', answer);
  entry.set('task_creation_timestamp', timestamp);
  insertEntry('task', entry);
}

function addQuestion(id, taskId, imageUrl) {
  const entry = new Map();
  entry.set('question_id', id);
  entry.set('task_id', taskId);
  entry.set('image_url', `'${imageUrl}'`);
  insertEntry('question', entry);
}

function addAnswer(id, questionId, raterId, answer) {
  const entry = new Map();
  entry.set('answer_id', id);
  entry.set('question_id', questionId);
  entry.set('answer_rater_id', raterId);
  entry.set('answer_string', `'${answer}'`);
  insertEntry('answer', entry);
}

eventEmitter.on('AddRater', addRater);
eventEmitter.on('AddRequester', addRequester);
eventEmitter.on('AddTask', addTask);
eventEmitter.on('AddQuestion', addQuestion);
eventEmitter.on('AddAnswer', addAnswer);

exports.addRater = addRater;
exports.addRequester = addRequester;
exports.addTask = addTask;
exports.addQuestion = addQuestion;
exports.addAnswer = addAnswer;
