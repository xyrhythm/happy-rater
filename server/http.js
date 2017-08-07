const fs = require('fs');
const formidable = require('formidable');
const express = require('express');

const db = require('../data_store/db');

// TODO(fenghaolw): Figure out ACLs for urls.
app = express();
app.get('/', function(req, res) {
  serveStaticFile('server/index.html', 'text/html', res);
});

app.get('/content.js', function(req, res) {
  serveStaticFile('server/content.js', 'javascript', res);
});

app.get('/showRater', function(req, res) {
  db.viewTable('rater', function(result) {
    res.writeHead(200, {
      'Content-Type': 'text/plain',
    });
    res.write(JSON.stringify(result));
    res.end();
  });
});

app.post('/addRater', function(req, res) {
  let form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    // TODO(fenghaolw): We probably can use a common API insertEntry
    db.addRater(fields.rater_id, fields.rater_account, fields.rater_nickname);
    res.end();
  });
});

function serveStaticFile(filePath, contentType, response) {
  fs.readFile(filePath, function(err, content) {
    if (err) {
      response.writeHead(404);
      console.log(err);
      response.end();
      return;
    }
    response.writeHead(200, {
      'Content-Type': contentType,
    });
    response.write(content);
    response.end();
  });
}

const server = app.listen(8080, function() {
  console.log('Web application is listening at http://localhost:%s',
    server.address().port);
});
