const {
  assign,
  functionObject
} = require("@ull-esit-pl/babel-plugin-left-side-support");
const foo = functionObject(function (a, b) {
  //console.log(a, b);
  return a + b;
});
assign(foo, [1, undefined], "Something else", []);
console.log(foo(1, undefined)); // "Something else"
console.log(foo(1)); // "Something else". Not working as intended?
console.log(foo(undefined)); // NaN