const {
  assign,
  functionObject
} = require("babel-plugin-left-side-support");
const foo = functionObject(function (bar) {
  return 1;
}, [undefined]);
let arr = [[[1, 2, 3], [4, 5, 6], [7, 8, 9]], [[11, 12, 13], [14, 15, 16], [17, 18, 19]], [[20, 21, 22], [23, 24, 25], [26, 27, 28]]];
// arr and arr2 have the same elements
let arr2 = [[[1, 2, 3], [4, 5, 6], [7, 8, 9]], [[11, 12, 13], [14, 15, 16], [17, 18, 19]], [[20, 21, 22], [23, 24, 25], [26, 27, 28]]];
// arr3 is different
let arr3 = [[[1, 2, 3], [4, 5, 6], [7, 8, 9]], [[11, 12, 13], [14, 100, 16], [17, 18, 19]], [[20, 21, 22], [23, 24, 25], [26, 27, 28]]];
assign(foo, [arr], 2, []);
console.log(foo(arr2)); // 2
console.log(foo(arr3)); // 1