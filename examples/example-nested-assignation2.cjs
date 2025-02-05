const {
  assign,
  functionObject,
  FunctionObject,
  Storage
} = require("@ull-esit-pl-2425/babel-plugin-left-side-support");
const foo = functionObject(function foo(a) {
  return functionObject(function bar(b) {
    return a + b;
  });
});
assign(foo, [6], foo(6)), assign(foo(6), [2], "Another value");
console.log(foo(6)(2)); // "Another Value"
console.log(foo(2)(3)); // 5
