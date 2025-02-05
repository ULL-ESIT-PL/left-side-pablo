const {
  assign,
  mAssign,
  functionObject,
  FunctionObject,
  Storage
} = require("@ull-esit-pl-2425/babel-plugin-left-side-support");
const foo = functionObject(function foo(a, b) {
  // foo gets currified automatically
  return a + b;
});
mAssign(foo, [2, 3], 1); // TODO: Make foo(2,3) = 1 work
console.log(foo(2)(3)); // 5
console.log(foo(2)(5)); // 7
