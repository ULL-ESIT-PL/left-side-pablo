const {
  assign,
  mAssign,
  functionObject,
  FunctionObject,
  Storage
} = require("@ull-esit-pl/babel-plugin-left-side-support");
const foo = functionObject(function foo(a) {
  return 2 * a;
});
mAssign(foo, [undefined], 5);
console.log(foo()); // 5
console.log(foo(3)); // 6
console.log(foo(undefined)); // 5
