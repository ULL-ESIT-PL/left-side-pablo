const {
  assign,
  functionObject
} = require("babel-plugin-left-side-support");
const foo = functionObject(function (bar) {
  return bar * 2;
}, [undefined]);
assign(foo, [10], 5, []);
console.log(foo(10)); // 5
console.log(foo(40)); // 80