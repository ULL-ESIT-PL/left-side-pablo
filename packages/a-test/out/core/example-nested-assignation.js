const {
  assign,
  functionObject
} = require("@ull-esit-pl/babel-plugin-left-side-support");
const foo = functionObject(function (a) {
  return functionObject(function (b) {
    return a + b;
  });
});
assign(foo, [5], 13, []);
assign(foo(6), [2], "Another value", []);
console.log(foo(2)(3)); // 5
console.log(foo(5)); // 13
console.log(foo(6)); // FunctionObject
console.log(foo(6)(2)); // 8