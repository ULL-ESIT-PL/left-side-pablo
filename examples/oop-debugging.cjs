const {
  assign,
  functionObject
} = require("@ull-esit-pl/babel-plugin-left-side-support");
const Person = function (name, age) {
  let self = functionObject(function () {
    throw "Error";
  });
  ;
  assign(self, ["name"], name, []);
  assign(self, ["age"], age, []);
  assign(self, ["greet"], function (other) {
    console.log(`My name is ${self("name")}.` + `Glad to meet you ${other}`);
  }, []);
  return self;
};
const Teacher = function (name, age, subjects) {
  let self = Person(name, age);
  assign(self, ["subjects"], subjects, []);
  return self;
};
const Juana = Person("Juana", 25);
console.log(typeof Juana);
console.log(Juana.toString());
console.log(Juana("name").toString());
const John = Teacher("John", 69, ["PL", "DMSI"]);
console.log(typeof John);
console.log(John("name"));
John("greet")("Juana");
console.log(John(`${John("name")} teaches subject` + John("subjects")[0]));
