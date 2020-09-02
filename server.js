var express = require('express');
var app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(8888, "172.26.0.1", () => {
  console.log("Example app listening at http://172.26.0.1:8888");
})