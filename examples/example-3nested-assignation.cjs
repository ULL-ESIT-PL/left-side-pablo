const {
  assign,
  mAssign,
  functionObject,
  FunctionObject,
  Storage
} = require("@ull-esit-pl/babel-plugin-left-side-support");
const foo = functionObject(function foo(a) {
  return functionObject(function bar(b) {
    return functionObject(function baz(c) {
      return a + b + c;
    });
  });
});
mAssign(foo, [2, 3, 5], "Another value");
console.log(foo(2)(3)(5)); // "Another Value"
console.log(foo(2)(3)(6)); // 11
console.log(foo(1)(3)(6)); // 10
