const {
  assign,
  functionObject
} = require("@ull-esit-pl/babel-plugin-left-side-support");
const foo = functionObject(function (bar) {
  return 1;
});
assign(foo, [Number("Im not a number")], 2, []);
console.log(foo(Number("Me neither"))); // 2