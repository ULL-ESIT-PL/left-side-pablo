const {
  assign,
  mAssign,
  functionObject,
  FunctionObject,
  Storage
} = require("@ull-esit-pl/babel-plugin-left-side-support");
const foo = functionObject(function foo(a) {
  return functionObject(function bar(b) {
    return a + b;
  });
});
mAssign(foo, [6, 2], "Another value");
console.log(foo(6)(2)); // "Another Value"
console.log(foo(2)(3)); // 5