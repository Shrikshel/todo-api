const express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

var todos = [{
  id:1,
  description: "Go to Bed",
  completed: false
},{
  id:2,
  description:"Eat something heavy!",
  completed:false
},{
  id:3,
  description:"Complete Angular JS!",
  completed:true
}];

app.get('/', function (req,res) {
  res.send('Yuppie! You are live on - TODO');
});

//GET /todos
app.get('/todos', function (req, res) {
  res.json(todos);
});

//GET /todos/:id
app.get('/todos/:id',function (req,res) {
  var todoId = req.params.id;
  var flag = false;

  for(var i = 0; i< todos.length; i++){
    if(todos[i].id == todoId){
      flag = true;
      res.send(todos[i]);
    }
  }

  if(!flag){
    res.status(404).send();
  }
});


app.listen(PORT, function () {
  console.log('Running on PORT: ' + PORT);
});
