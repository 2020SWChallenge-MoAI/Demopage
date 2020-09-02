var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('Hello World');
}).listen(8888, '172.26.0.1');
console.log('Server running at http://172.26.0.1:8888/');