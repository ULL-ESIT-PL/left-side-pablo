const {
  assign,
  functionObject
} = require("babel-plugin-left-side-support");
const foo = functionObject(function (bar) {
  return 1;
}, [undefined]);
let set1 = new Set([1, 2, 3]);
let set2 = new Set([1, 2]);
assign(foo, [set1], "some other value", []);
console.log(foo(set2)); // 1