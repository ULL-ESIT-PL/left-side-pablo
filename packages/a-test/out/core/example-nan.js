const {
  assign,
  functionObject
} = require("babel-plugin-left-side-support");
const foo = functionObject(function (bar) {
  return 1;
}, [undefined]);
assign(foo, [Number("Im not a number")], 2, []);
console.log(foo(Number("Me neither"))); // 2