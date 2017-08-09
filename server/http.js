const formidable = require('formidable');
const express = require('express');
const pug = require('pug');

const db = require('../data_store/db');

// TODO(fenghaolw): Figure out ACLs for urls.
app = express();
app.use(express.static('web'));

const dataTableRender = pug.compileFile(__dirname + '/templates/datatable.pug');

app.get('/showRater', function(req, res) {
  db.viewTable('rater', function(err, result) {
    if (err) {
      res.writeHead(500);
      res.end();
    } else {
      res.write(dataTableRender({
        raters: result,
      }));
      res.end();
    }
  });
});

app.post('/addRater', function(req, res) {
  let form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    db.insertEntry('rater', buildMap(fields), (err, result) => {
      if (err) {
        // TODO(fenghaolw): provide better error message.
        res.writeHead(500);
      }
      res.end();
    });
  });
});

app.post('/deleteRater', function(req, res) {
  let form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    db.deleteEntry('rater', {
      rater_id: fields.rater_id,
    }, (err, result) => {
      if (err) {
        res.writeHead(500);
      }
      res.end();
    });
  });
});

// Convert a regular JS object to a ES6 map.
// Always quote the values to avoid SQL syntax errors.
function buildMap(obj) {
  return Object.keys(obj).reduce(
    (map, key) => map.set(key, `'${obj[key]}'`), new Map());
}

const server = app.listen(8080, function() {
  console.log('Web application is listening at http://localhost:%s',
    server.address().port);
});
