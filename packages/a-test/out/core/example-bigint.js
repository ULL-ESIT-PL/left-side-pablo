const {
  assign,
  functionObject
} = require("@ull-esit-pl/babel-plugin-left-side-support");
const foo = functionObject(function (bar) {
  return 0;
});
let firstBigInt = 1000000000000000000000000000000000000n;
let firstBigIntCopy = 1000000000000000000000000000000000000n;
let secondBigInt = 1000000000000000000000000000000000001n;
assign(foo, [firstBigInt], 1, []);
console.log(foo(firstBigInt)); // 1
console.log(foo(firstBigIntCopy)); // 1
console.log(foo(secondBigInt)); // 0