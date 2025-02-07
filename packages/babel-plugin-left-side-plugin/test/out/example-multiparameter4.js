const {
  assign,
  mAssign,
  functionObject,
  FunctionObject,
  Storage
} = require("@ull-esit-pl/babel-plugin-left-side-support");
const foo = functionObject(function foo(a, b) {
  //console.log(a, b);
  return a + b;
});
mAssign(foo, [[1, undefined]], "Something else");
console.log(foo(1, undefined)); // "Something else"
console.log(foo(1)); // "Something else". Not working as intended?
console.log(foo(undefined)); // NaN