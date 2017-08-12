const mysql = require('mysql');

const con = mysql.createConnection({
  host: 'rater-dev.cwvjfre1hpn6.us-west-1.rds.amazonaws.com',
  port: 3306,
  user: 'ratermaster',
  password: '317rater',
  database: 'happyrater'
});

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
  querySql(`SELECT * FROM ${tableName} LIMIT 100`, callback);
}

// TODO(fenghaolw): All of these should support batch updates.
// entry is a ES6 Map
function insertEntry(tableName, entry, callback) {
  const fields = Array.from(entry.keys()).join(',');
  const values = Array.from(entry.values()).join(',');
  querySql(
    `INSERT INTO ${tableName} (${fields}) VALUES (${values});`,
    callback
  );
}

function deleteEntry(tableName, entry, callback) {
  // TODO: don't hard-code rater_id.
  const sql = `DELETE FROM ${tableName} WHERE rater_id=${entry.rater_id};`;
  querySql(sql, callback);
}

exports.insertEntry = insertEntry;
exports.deleteEntry = deleteEntry;
exports.viewTable = viewTable;
