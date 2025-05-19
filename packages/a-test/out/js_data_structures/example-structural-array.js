const {
  assign,
  functionObject
} = require("@ull-esit-pl/babel-plugin-left-side-support");
const foo = functionObject(function (bar) {
  return 1;
}, [undefined]);
let arr1 = [1, 2, 3];
let arr2 = [1, 2, 3];
let arr3 = [2, 3, 4];
assign(foo, [arr1], "some other value", []);
console.log(foo(arr2)); // "some other value"
console.log(foo(arr3)); // 1