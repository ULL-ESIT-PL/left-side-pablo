const {
  assign,
  functionObject
} = require("@ull-esit-pl/babel-plugin-left-side-support");
const foo = functionObject(function (bar) {
  return 1;
}, [undefined]);
assign(foo, [function () {
  return null;
}], 0, []);
console.log(foo(function () {
  return null;
})); // Not the same function, they don't share the same reference. Expect 1