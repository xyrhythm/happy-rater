var events = require('events');
var mysql = require('mysql');

var eventEmitter = new events.EventEmitter();

var con = mysql.createConnection({
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

var querySql = function(sql) {
  con.query(sql, function(err, result) {
    if (err) throw err;
    console.log('Inserted one entry.');
  });
}

var quoteStr = function(str) {
  return '\'' + str + '\'';
}

// TODO(fenghaolw): All of these should support batch updates.
var AddTask = function(type) {
  var sql = 'INSERT INTO tasks (type) VALUES (\'' + type + '\');';
  querySql(sql);
}

var AddRater = function(rater_id, first_name, last_name) {
  var sql = 'INSERT INTO raters (id, first_name, last_name) VALUES ('
      + [rater_id, quoteStr(first_name), quoteStr(last_name)].join(',') + ');';
  querySql(sql);
};

var AddQuestion = function(question_id, description, image_url, task_id) {
  var sql = 'INSERT INTO questions (id, task_id, description, image_url) VALUES ('
      + [question_id, task_id, quoteStr(description), quoteStr(image_url)].join(',') + ');';
  querySql(sql);
};

var AddRecord = function(record_id, rater_id, question_id, response) {
  var sql = 'INSERT INTO records (id, rater_id, question_id, response) VALUES ('
      + [record_id, rater_id, question_id, quoteStr(response)].join(',') + ');';
  querySql(sql);
};

eventEmitter.on('AddTask', AddTask);
eventEmitter.on('AddRater', AddRater);
eventEmitter.on('AddQuestion', AddQuestion);
eventEmitter.on('AddRecord', AddRecord);
