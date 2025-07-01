const Person = function(name, age) {
  function @@ self () { throw "Error" };
  self("name") = name;
  self("age") = age;
  self("greet") = function(other) {
    console.log(`My name is ${self("name")}.`+
      `Glad to meet you ${other}`)
  };
  return self
};

const Teacher = function(name, age, subjects) {
  let self = Person(name, age);
  self("subjects") = subjects;
  return self;
};

const John = Teacher("John", 69, ["PL", "DMSI"]);
John("greet")("Juana");
console.log(John(`${John("name")} teaches subject`+
  John("subjects")[0]));