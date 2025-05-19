const {
  assign,
  functionObject
} = require("@ull-esit-pl/babel-plugin-left-side-support");
const foo = functionObject(function (a, b, c) {
  return a + b + c;
}, [undefined, undefined, undefined]);
assign(foo, [1, 5, 3], 13, []);
console.log(foo(1, 2, 3)); // 6
console.log(foo(1, 5, 3)); // 13