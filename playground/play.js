const Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
  'dialect': 'sqlite',
  'storage': __dirname + '/play.sqlite'
});

var Todo = sequelize.define('todo', {
  description: {
    type: Sequelize.STRING,
    allowNull: false,
    validate:{
      len: [1-250]
    }
  },
  completed: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
});

sequelize.sync({
//  force: true
}).then(function(){
  // console.log('Everythings synced!');
  //
  // Todo.create({
  //   description:'Read Another Comics!'
  // }).then(function(todo){
  //   return Todo.create({
  //     description: 'Write Diary! Go'
  //   });
  // }).then(function(){
  //   return Todo.findById(1);
  // }).then(function(todo){
  //   if(todo){
  //     console.log(todo.toJSON());
  //   }else{
  //     console.log('Sry! Not Found!');
  //   }
  // }).catch(function(e){
  //   console.log(e);
  // })

  Todo.findById(2).then(function(todo){
    console.log(todo.toJSON());
  });
});
