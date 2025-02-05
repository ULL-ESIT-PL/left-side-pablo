const {
  assign,
  mAssign,
  functionObject,
  FunctionObject
} = require("@ull-esit-pl-2425/babel-plugin-left-side-support");

let foo = new FunctionObject(function (a, b) { // Currified
  return a + b;
});
mAssign(foo, [2, 3], 1); // The call f(2,3) is not yet implemented
console.log(foo(2)(3)); // 1
console.log(foo(2)(5)); // 7
