const {
  assign,
  functionObject
} = require("@ull-esit-pl/babel-plugin-left-side-support");
const foo = functionObject(function (param1, param2 = 1) {
  return 0;
}, [undefined, 1]); // Implicitly assignment to foo(0, 1)
assign(foo, [0], 1, []);
console.log(foo(0)); // 1
console.log(foo(0, 1)); // 1
// Explicitly assignment to foo(1, 1)
assign(foo, [1, 1], 2, []);
console.log(foo(1)); // 2
console.log(foo(1, 1)); // 2