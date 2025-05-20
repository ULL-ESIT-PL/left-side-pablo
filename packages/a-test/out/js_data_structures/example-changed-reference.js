const {
  assign,
  functionObject
} = require("babel-plugin-left-side-support");
const foo = functionObject(function (bar) {
  return 0;
}, [undefined]);
let arr = [1, 2, 3, 4];
let otherArr = [1, 2, 3];
assign(foo, [arr], 1, []);
console.log(foo(otherArr)); // 0, default behaviour
arr.pop(); // arr === [1,2,3] === otherArr
console.log(foo(otherArr)); // 0, the reference was changed but was assigned to a certain structure