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

//Two same routes can't be there.. DANGER
//GET /todos
// app.get('/todos', function (req, res) {
//   res.json(todos);
// });

//GET /todos?completed=true&q=work
app.get('/todos', function (req, res) {
  var queryParams = req.query;
  var filteredTodos = todos;

  if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true'){
    filteredTodos = _.where(filteredTodos, {completed: true});
  }else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
    filteredTodos = _.where(filteredTodos, {completed: false});
  }

  if(queryParams.hasOwnProperty('q') && queryParams.q.length > 0){
    filteredTodos = _.filter(filteredTodos, function(todo){
      return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
    });
  }
  res.json(filteredTodos);
});

//GET /todos/:id
app.get('/todos/:id',function (req,res) {
  var todoId = parseInt(req.params.id,10);
  var matchedTodo = _.findWhere(todos, { id: todoId});

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

//PUT /todos/:id
app.put('/todos/:id', function(req,res){
  var todoId = parseInt(req.params.id,10);
  var matchedTodo = _.findWhere(todos, {id: todoId});
  var body = _.pick(req.body, 'description','completed');
  var validAttrib = {};

  if(!matchedTodo){
    return res.status(404).send();
  }

  if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
    validAttrib.completed = body.completed;
  }else if (body.hasOwnProperty('completed')) {
    return res.status(400).send();
  }

  if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim() > 0){
    validAttrib.description = body.description;
  }else if(body.hasOwnProperty('description')){
    return res.status(400).send();
  }

  _.extend(matchedTodo, validAttrib);
  res.json(matchedTodo);
});

//DELETE /todos/:id
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
