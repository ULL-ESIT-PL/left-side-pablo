const {
  assign,
  functionObject
} = require("@ull-esit-pl/babel-plugin-left-side-support");
const foo = functionObject(function (bar) {
  return 1;
});
let obj1 = {
  a: "some"
};
let obj2 = {
  a: "some",
  b: "thing"
};
assign(foo, [obj1], "some other value", [0]); // Partial match syntax
console.log(foo(obj2)); // "some other value"