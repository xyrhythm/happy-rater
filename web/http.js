const express = require('express');
const bodyParser = require('body-parser');

const db = require('./db');

// TODO(fenghaolw): Figure out ACLs for urls.
app = express();
app.use(express.static('build'));

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

app.get('/getRater', function(req, res) {
  db.viewTable('rater', function(err, result) {
    if (err) {
      res.writeHead(500);
      res.end();
    } else {
      res.write(JSON.stringify(result));
      res.end();
    }
  });
});

app.post('/addRater', function(req, res) {
  db.insertEntry('rater', buildMap(req.body), (err, result) => {
    if (err) {
      // TODO(fenghaolw): provide better error message.
      res.writeHead(500);
    }
    res.end();
  });
});

app.post('/deleteRater', function(req, res) {
  db.deleteEntry(
    'rater',
    buildMap(req.body),
    (err, result) => {
      if (err) {
        res.writeHead(500);
      }
      res.end();
    }
  );
});

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
