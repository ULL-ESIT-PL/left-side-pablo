const {
  assign,
  functionObject
} = require("@ull-esit-pl/babel-plugin-left-side-support");
const foo = functionObject(function (bar) {
  return 0;
}, [undefined]); // Error.prototype.name and Error.message are not enumerable, but should be compared anyways.
let error1 = new Error("A normal error");
let error2 = new SyntaxError("A syntax error");
assign(foo, [error1], 1, []);
console.log(foo(error1)); // 1
console.log(foo(error2)); // 0