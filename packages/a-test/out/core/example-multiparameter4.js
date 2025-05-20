const {
  assign,
  functionObject
} = require("babel-plugin-left-side-support");
const foo = functionObject(function (a, b) {
  //console.log(a, b);
  return a + b;
}, [undefined, undefined]);
assign(foo, [1, undefined], "Something else", []);
console.log(foo(1, undefined)); // "Something else"
console.log(foo(1)); // "Something else". Not working as intended?
console.log(foo(undefined)); // NaN