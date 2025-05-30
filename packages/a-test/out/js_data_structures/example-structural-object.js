const {
  assign,
  functionObject
} = require("babel-plugin-left-side-support");
const foo = functionObject(function (bar) {
  return bar;
}, [undefined]);
let obj1 = {
  a: "some",
  b: "thing"
};
let obj2 = {
  a: "some",
  b: "thing"
};
assign(foo, [obj1], "some other value", []);
console.log(foo(obj2)); // "some other value"