const express = require('express');
const bodyParser = require('body-parser');
const _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoID = 1;

//Body Parser
app.use(bodyParser.json());

//Default Page
app.get('/', function (req,res) {
  res.send('Yuppie! You are live on - TODO');
});

//GET /todos
app.get('/todos', function (req, res) {
  res.json(todos);
});

//GET /todos/:id
app.get('/todos/:id',function (req,res) {
  var todoId = parseInt(req.params.id,10);
  var matchedTodo = _.findWhere(todos, { id: todoId});

  console.log(matchedTodo);

  if(matchedTodo){
    res.json(matchedTodo);
  }else{
    res.status(404).send();
  }
});

//POST /todos
app.post('/todos', function(req,res){
  var body = _.pick(req.body, 'description','completed');

  if (! _.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
    return res.status(404).send();
  }

  body.description = body.description.trim();

  body.id = todoID;
  todos.push(body);
  todoID++;

  res.send(body);
});

//DELETE /todos/:?
app.delete('/todos/:id', function(req,res){
  var todoId = parseInt(req.params.id,10);
  var matchedTodo = _.findWhere(todos, {id: todoId});

  if(!matchedTodo){
    return res.status(404).send();
  }else{
    todos = _.without(todos, matchedTodo);
    res.json(matchedTodo);
  }
});

//Server Config
app.listen(PORT, function () {
  console.log('Running on PORT: ' + PORT);
});
