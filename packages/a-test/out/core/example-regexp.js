const {
  assign,
  functionObject
} = require("babel-plugin-left-side-support");
const foo = functionObject(function (bar) {
  return 0;
}, [undefined]);
let firstRegexp = /abc/g;
let firstRegexpCopy = /abc/g;
let secondRegexp = /def/g;
let almostFirstRegexp = /abc/;
assign(foo, [firstRegexp], 1, []);
console.log(foo(firstRegexp)); // 1
console.log(foo(firstRegexpCopy)); // 1
console.log(foo(secondRegexp)); // 0
console.log(foo(almostFirstRegexp)); // 0