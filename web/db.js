const mysql = require('mysql');

const con = mysql.createConnection({
  host: 'rater-dev.cwvjfre1hpn6.us-west-1.rds.amazonaws.com',
  port: 3306,
  user: 'ratermaster',
  password: '317rater',
  database: 'happyrater'
});

// TODO(xyrhythm): Add connection pool.
con.connect(function(err) {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL!');
});

function querySql(sql, callback) {
  con.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    }
    callback(err, result);
  });
}

/*
Generic mysql queries.
*/
function viewTable(tableName, callback) {
  const query = mysql.format('SELECT * FROM ?? LIMIT 100', [tableName]);
  querySql(query, callback);
}

// This function is meant for reading a single (or a few) rows.
// For reads with many rows, be sure to use pagination.
function getEntry(tableName, condition, callback) {
  const conditionTerms = [];
  const queryInserts = [tableName];
  const fields = Array.from(condition.keys());
  const values = Array.from(condition.values());
  for (i = 0; i < fields.length; ++i) {
    conditionTerms.push('?? = ?');
    queryInserts.push(fields[i]);
    queryInserts.push(values[i]);
  }
  const query = mysql.format(
    'SELECT * FROM ?? WHERE ' + conditionTerms.join(' AND '),
    queryInserts
  );
  querySql(query, callback);
}

// TODO(xyrhythm): Need to support batch insert/update.
function insertEntry(tableName, entry, callback) {
  const insertTerms = [];
  const queryInserts = [tableName];
  const entryFields = Array.from(entry.keys());
  const entryValues = Array.from(entry.values());
  for (i = 0; i < entryFields.length; ++i) {
    insertTerms.push('?? = ?');
    queryInserts.push(entryFields[i]);
    queryInserts.push(entryValues[i]);
  }

  const query = mysql.format(
    'INSERT INTO ?? SET ' + insertTerms.join(', '),
    queryInserts
  );
  querySql(query, callback);
}

function deleteEntry(tableName, condition, callback) {
  const conditionTerms = [];
  const queryInserts = [tableName];
  const fields = Array.from(condition.keys());
  const values = Array.from(condition.values());
  for (i = 0; i < fields.length; ++i) {
    conditionTerms.push('?? = ?');
    queryInserts.push(fields[i]);
    queryInserts.push(values[i]);
  }
  const query = mysql.format(
    'DELETE FROM ?? WHERE ' + conditionTerms.join(' AND '),
    queryInserts
  );
  querySql(query, callback);
}

function updateEntry(tableName, entry, condition, callback) {
  const updateTerms = [];
  const queryInserts = [tableName];
  const entryFields = Array.from(entry.keys());
  const entryValues = Array.from(entry.values());
  for (i = 0; i < entryFields.length; ++i) {
    updateTerms.push('?? = ?');
    queryInserts.push(entryFields[i]);
    queryInserts.push(entryValues[i]);
  }

  const conditionTerms = [];
  const conditionFields = Array.from(condition.keys());
  const conditionValues = Array.from(condition.values());
  for (i = 0; i < conditionFields.length; ++i) {
    conditionTerms.push('?? = ?');
    queryInserts.push(conditionFields[i]);
    queryInserts.push(conditionValues[i]);
  }

  const query = mysql.format(
    'UPDATE ?? SET ' +
      updateTerms.join(', ') +
      ' WHERE ' +
      conditionTerms.join(' AND '),
    queryInserts
  );
  querySql(query, callback);
}

function checkLogin(tableName, entry, callback) {
  const query = mysql.format('SELECT `password` FROM ?? WHERE `account` = ?', [
    tableName,
    entry.account
  ]);
  querySql(query, callback);
}

/*
APIs for rater's view.
*/
// options = {rater_id: }
function getTasksForRater(options, callback) {
  const query = mysql.format(
    'SELECT `task_id`, `num_answer` FROM ratertask WHERE `rater_id` = ?',
    [options.rater_id]
  );
  querySql(query, callback);
}

// options = {task_id: , offset: , page_size: }
function getQuestionsForTask(options, callback) {
  const query = mysql.format(
    'SELECT `question_id`, `image_url` FROM question' +
      'WHERE `task_id` = ? LIMIT ? ?',
    [options.task_id, options.offset, options.page_size]
  );
  querySql(query, callback);
}

// options = {rater_id: , task_id: }
// Note this function only returns question_id that the rater has answered
// for the task - answer_json is deliberately skipped.
function getAnswersForRaterForTask(options, callback) {
  const query = mysql.format(
    'SELECT `question_id` FROM answer WHERE `rater_id` = ? AND `task_id` = ?',
    [options.rater_id, options.task_id]
  );
  querySql(query, callback);
}

/*
APIs for requester/owner's view.
*/
// options = {requester_id: }
function getTasksForRequester(options, callback) {
  const query = mysql.format(
    'SELECT `task_id`, `num_question`, `num_answer_collected` ' +
      'FROM requestertask WHERE `requester_id` = ?',
    [options.requester_id]
  );
  querySql(query, callback);
}

exports.viewTable = viewTable;
exports.getEntry = getEntry;
exports.insertEntry = insertEntry;
exports.deleteEntry = deleteEntry;
exports.updateEntry = updateEntry;

exports.checkLogin = checkLogin;

exports.getTasksForRater = getTasksForRater;
exports.getQuestionsForTask = getQuestionsForTask;
exports.getAnswersForRaterForTask = getAnswersForRaterForTask;

exports.getTasksForRequester = getTasksForRequester;
