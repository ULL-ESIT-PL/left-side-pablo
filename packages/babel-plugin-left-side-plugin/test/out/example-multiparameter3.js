const {
  assign,
  mAssign,
  functionObject,
  FunctionObject,
  Storage
} = require("@ull-esit-pl/babel-plugin-left-side-support");
const foo = functionObject(function foo(a, b, c) {
  return a + b + c;
});
mAssign(foo, [[1, undefined, 3]], "Im undefined!");
console.log(foo(1, 2, 3)); // 6
console.log(foo(1, undefined, 3)); // "Im undefined!"