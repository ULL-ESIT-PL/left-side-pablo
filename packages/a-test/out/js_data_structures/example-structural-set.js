const {
  assign,
  functionObject
} = require("@ull-esit-pl/babel-plugin-left-side-support");
const foo = functionObject(function (bar) {
  return bar;
}, [undefined]);
let set1 = new Set([1, 2, 3]);
let set2 = new Set([1, 2, 3]);
assign(foo, [set1], "some other value", []);
console.log(foo(set2)); // "some other value"