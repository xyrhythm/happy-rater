const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const db = require('./db');

// TODO(fenghaolw): Figure out ACLs for urls.
app = express();
app.use(express.static(path.resolve(__dirname, 'build')));

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

app.get('/getRaters', getDataFromTable('rater'));
app.post('/addRater', insertDataIntoTable('rater'));
app.post('/deleteRater', deleteDataFromTable('rater'));
app.post('/updateRater', updateDataFromTable('rater'));

app.get('/getTasks', getDataFromTable('task'));
app.post('/addTask', insertDataIntoTable('task'));
app.post('/deleteTask', deleteDataFromTable('task'));
app.post('/updateTask', updateDataFromTable('task'));

// Always redirect to home page for any other requests.
// This simplifies the development since we won't need to type the URL.
// Note that this uses wildcard matching since this must be after all other
// request handlers.
app.get('*', function(req, res) {
  res.redirect('/');
});

// Helper function for reading data from a particular table.
// This returns a function that can be used as a callback for request handlers.
function getDataFromTable(tableName) {
  return (req, res) => {
    db.viewTable(tableName, function(err, result) {
      if (err) {
        res.writeHead(500);
        res.end();
      } else {
        res.write(JSON.stringify(result));
        res.end();
      }
    });
  };
}

function insertDataIntoTable(tableName) {
  return (req, res) => {
    db.insertEntry(tableName, buildMap(req.body), (err, result) => {
      if (err) {
        // TODO(fenghaolw): provide better error message.
        res.writeHead(500);
      }
      res.end();
    });
  };
}

function deleteDataFromTable(tableName) {
  return (req, res) => {
    db.deleteEntry(tableName, buildMap(req.body), (err, result) => {
      if (err) {
        // TODO(fenghaolw): provide better error message.
        res.writeHead(500);
      }
      res.end();
    });
  };
}

function updateDataFromTable(tableName) {
  return (req, res) => {
    db.updateEntry(
      tableName,
      buildMap(req.body.entries),
      buildMap(req.body.conditions),
      (err, result) => {
        if (err) {
          // TODO(fenghaolw): provide better error message.
          res.writeHead(500);
        }
        res.end();
      }
    );
  };
}

// Convert a regular JS object to a ES6 map.
// Always quote the values to avoid SQL syntax errors.
function buildMap(obj) {
  return Object.keys(obj).reduce(
    (map, key) => map.set(key, obj[key]),
    new Map()
  );
}

const server = app.listen(8080, function() {
  console.log(
    'Web application is listening at http://localhost:%s',
    server.address().port
  );
});
