const {
  assign,
  functionObject
} = require("babel-plugin-left-side-support");
const foo = functionObject(function (bar) {
  return 0;
}, [undefined]);
let firstDate = new Date(2024, 0, 25);
let firstDateCopy = new Date(2024, 0, 25);
let secondDate = new Date(2024, 0, 24);
assign(foo, [firstDate], 1, []);
console.log(foo(firstDate)); // 1
console.log(foo(firstDateCopy)); // 1
console.log(foo(secondDate)); // 0