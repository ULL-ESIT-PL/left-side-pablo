const {
  assign,
  mAssign,
  functionObject,
  FunctionObject,
  Storage
} = require("@ull-esit-pl/babel-plugin-left-side-support");
const foo = functionObject(function foo(x, y) {
  return functionObject(function bar(z, w) {
    return x + y + z + w;
  });
});
mAssign(foo, [["one", "two"], ["three", "four"]], null);
console.log(foo(1, 2)(3, 4)); // 10
console.log(foo("one", "two")("three", "four")); // null
