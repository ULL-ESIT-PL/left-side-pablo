const {
  assign,
  functionObject
} = require("@ull-esit-pl/babel-plugin-left-side-support");
const foo = functionObject(function (a, b) {
  //console.log(a, b);
  return a + b;
}, [undefined, undefined]);
assign(foo, [undefined, 1], "Something else", []);
assign(foo, [null, 1], "Something something else", []);
console.log(foo(undefined, 1)); // "Something else"
console.log(foo(null, 1)); // "Something something else".
console.log(foo(1, 2)); // 3