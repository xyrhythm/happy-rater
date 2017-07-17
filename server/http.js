var http = require('http');

// TODO(fenghaolw): Add a simple page that allows us to modify the database.
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('Hello World!');
    res.write(req.url);
    res.end();
}).listen(8080);