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

function viewTable(tableName, callback) {
  const query = mysql.format('SELECT * FROM ?? LIMIT 100', [tableName]);
  querySql(query, callback);
}

// entry and condition are ES6 Maps.
// TODO(xyrhythm): Need to support batch insert/delete/update.
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

exports.insertEntry = insertEntry;
exports.deleteEntry = deleteEntry;
exports.updateEntry = updateEntry;
exports.viewTable = viewTable;
