const express = require('express');
const bodyParser = require('body-parser');
const _ = require('underscore');
const db = require('./db');

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
  var where = {};

  if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true'){
    where.completed = true;
  }else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
    where.completed = false;
  }

  if(queryParams.hasOwnProperty('q') && queryParams.q.length > 0){
    where.description = {
      $like: '%' + queryParams.q + '%'
    }
  }
  db.todo.findAll({where:where}).then(function(todos){
    res.json(todos)
  }, function (e){
    res.status(500).send();
  });
});

//GET /todos/:id
app.get('/todos/:id',function (req,res) {
  var todoId = parseInt(req.params.id,10);

  db.todo.findById(todoId).then(function(todo){
    if(!!todo){
      res.json(todo.toJSON());
    }else{
      res.status(404).send();
    }
  }, function(e){
    res.status(500).send();
  });
});

//POST /todos
app.post('/todos', function(req,res){
  var body = _.pick(req.body, 'description','completed');

  db.todo.create(body).then(function(todo){
    res.json(todo.toJSON());
  }, function(e){
    res.status(400).json(e);
  });
});

//PUT /todos/:id
app.put('/todos/:id', function(req,res){
  var todoId = parseInt(req.params.id,10);
  var body = _.pick(req.body, 'description','completed');
  var attrib = {};

  if(body.hasOwnProperty('completed')){
    attrib.completed = body.completed;
  }

  if(body.hasOwnProperty('description')){
    attrib.description = body.description;
  }

  db.todo.findById(todoId).then(function(todo){
    if(todo){
      todo.update(attrib).then(function(todo){
        res.json(todo)
      },function(e){
        res.status(400).send();
      });
    }else{
      res.status(404).send();
    }
  },function(){
    res.status(500).send();
  })
});

//DELETE /todos/:id
app.delete('/todos/:id', function(req,res){
  var todoId = parseInt(req.params.id,10);

  db.todo.destroy({where: {
    id:todoId
  }}).then(function(rowsDeleted){
    if(rowsDeleted == 0){
      res.status(404).json({
        error:'No Todos Found!'
      });
    }else{
      res.status(204).send();
    }
  }, function(){
    res.status(500).send();
  });
});

db.sequelize.sync().then(function(){
  //Server Config
  app.listen(PORT, function () {
    console.log('Running on PORT: ' + PORT);
  });
});
