const {
  assign,
  functionObject
} = require("babel-plugin-left-side-support");
const foo = functionObject(function (bar, x) {
  return bar + x;
}, [undefined, undefined]);
assign(foo, ["one", "two"], null, []);
console.log(foo(1, 2)); // 3
console.log(foo("grass", "hopper")); // grasshopper
console.log(foo("one", "two")); // null
console.log(foo("one")); // oneundefined