const {
  assign,
  functionObject
} = require("@ull-esit-pl/babel-plugin-left-side-support");
const foo = functionObject(function (bar) {
  return bar;
});
let arr1 = [1, 2, 3];
let arr2 = [1, 2, 3];
assign(foo, [arr1], "some other value");
console.log(foo(arr2)); // "some other value"