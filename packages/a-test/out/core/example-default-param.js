const {
  assign,
  functionObject
} = require("babel-plugin-left-side-support");
const foo = functionObject(function (param1, param2 = 1) {
  return 0;
}, [undefined, 1]); // Implicit assignment to foo(0, 1)
assign(foo, [0], 1, []);
console.log(foo(0)); // 1
console.log(foo(0, 1)); // 1
// Explicit assignment to foo(1, 1)
assign(foo, [1, 1], 2, []);
console.log(foo(1)); // 2
console.log(foo(1, 1)); // 2