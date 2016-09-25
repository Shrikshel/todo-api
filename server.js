const express = require('express');
var app = express();
var PORT = process.env.port || 3000;

app.get('/', function (req,res) {
  res.send('Yuppie! You are live on - TODO');
})

app.listen(PORT, function () {
  console.log('Running on PORT: ' + PORT);
})
