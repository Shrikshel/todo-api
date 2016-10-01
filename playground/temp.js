function print(name){
  console.log(name);
};

print({
  name:'Shrikshel'
}).then(print({
  name:'Shubham'
}));
