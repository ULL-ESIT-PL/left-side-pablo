const {
  assign,
  mAssign,
  functionObject,
  FunctionObject,
  Storage
} = require("@ull-esit-pl-2425/babel-plugin-left-side-support");
const foo = functionObject(function foo() {
  return functionObject(function bar(a) {
    return a + 2;
  });
});
mAssign(foo, [[], 6], "Another value");
console.log(foo()(2)); // 4
console.log(foo()(4)); // "Another value"
