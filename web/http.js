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

// TODO(fenghaolw): Move login pieces to the correct place.
app.get('/login', checkLoginForTable('rater'));
app.get('/loginRequester', checkLoginForTable('requester'));
app.get('/loginAdmin', checkLoginForTable('admin'));

app.post('/signup', createLoginForTable('rater'));
app.post('/signupRequester', createLoginForTable('requester'));

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
}

function checkLoginForTable(tableName) {
  return (req, res) => {
    db.checkLogin(tableName, buildMap(req.body), (err, result) => {
      if (err) {
        // TODO(fenghaolw): provide better error message.
        res.writeHead(500);
      } else {
        if (result.length < 1) {
          res.write({code: -1, msg: 'account not found.'});
        } else {
          const savedPass = result[0].password;
          bcrypt.compare(req.body.password, savedPass).then( (result) => {
            if (result) {
              res.write({code: 0, msg: 'logged in.'});
            } else {
              res.write({code: -2, msg: 'wrong password.'});
            }
          });
        }
      }
    });
    res.end();
  };
}

// Check whether a provided password meets the requirments.
function isGoodPassword(password) {
  return password.length >= 8;
}

function createLoginForTable(tableName) {
  return (req, res) => {
    const providedPass = req.body.password;
    if (isGoodPassword(providedPass)) {
      var reqBody = req.body;
      bcrypt.hash(providedPass, saltRounds, (err, hash) => {
        if (err) {
          res.writeHead(500);
        } else {
          reqBody.password = hash;
          db.insertEntry(tableName, buildMap(reqBody), (err, result) => {
            if (err) {
              // TODO(fenghaolw): provide better error message.
              res.writeHead(500);
            }
          });
        }
      });
    } else {
      res.write({code: -1, msg: 'Need a better password.'});
    }
    res.end();
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
