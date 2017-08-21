const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const saltRounds = 10;

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

const loginTables = ['rater', 'requester', 'admin'];

app.post('/login', (req, res) => {
  const tableName = loginTables[req.body.type - 1];
  const reqBody = {
    account: req.body.account,
    password: req.body.password
  };
  db.checkLogin(tableName, reqBody, (err, result) => {
    if (err) {
      res.status(500).send({error: err.code});
    } else {
      if (result.length < 1) {
        res.status(500).send({error: 'ACC_NOT_FOUND'});
      } else {
        const savedPass = result[0].password;
        bcrypt.compare(req.body.password, savedPass).then((result) => {
          if (result) {
            res.status(200).send({});
          } else {
            res.status(500).send({error: 'INCORRECT_PWD'});
          }
        });
      }
    }
  });
});

app.post('/signup', (req, res) => {
  const tableName = loginTables[req.body.type - 1];
  const reqBody = req.body;
  delete reqBody.type;
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    if (err) {
      res.status(500).send({error: err.code});
    } else {
      reqBody.password = hash;
      // By default use account as username.
      if (!reqBody.username) {
        reqBody.username = reqBody.account;
      }
      db.insertEntry(tableName, buildMap(reqBody), (err, result) => {
        if (err) {
          res.status(500).send({error: err.code});
        } else {
          res.status(200).send({});
        }
      });
    }
  });
});

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
