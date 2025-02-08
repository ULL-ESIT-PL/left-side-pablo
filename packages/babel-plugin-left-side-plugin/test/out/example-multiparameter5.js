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
mAssign(foo, [[undefined, 1]], "Something else");
mAssign(foo, [[null, 1]], "Something something else");
console.log(foo(undefined, 1)); // "Something else"
console.log(foo(null, 1)); // "Something something else".
console.log(foo(1, 2)); // 3