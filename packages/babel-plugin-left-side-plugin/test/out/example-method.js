const {
  assign,
  mAssign,
  functionObject,
  FunctionObject,
  Storage
} = require("@ull-esit-pl/babel-plugin-left-side-support");
let a = {
  foo: functionObject(function something(a) {
    return a;
  })
};
mAssign(a.foo, ["bar"], "fighter");
console.log(a.foo("x")); // x
console.log(a.foo("bar")); // fighter