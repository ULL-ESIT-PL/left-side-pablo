const {
  assign,
  functionObject
} = require("@ull-esit-pl/babel-plugin-left-side-support");
const Person = function (name, age) {
  const self = functionObject(function () {
    return "¡Esto parece devolverse siempre!";
  });
  ;
  assign(self, ["name"], name);
  assign(self, ["age"], age);
  assign(self, ["greet"], function (other) {
    console.log(`My name is ${self("name")}.` + `Glad to meet you ${other}`);
  });
  return self;
};

const Juana = Person("Juana", 25);
console.log(Juana.toString().substring(0, 50));
console.log(Juana("name")); // ¡Esto parece devolverse siempre!
console.log(Juana("age"));  // ¡Esto parece devolverse siempre!

