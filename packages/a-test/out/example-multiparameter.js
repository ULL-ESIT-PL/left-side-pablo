const {
  assign,
  functionObject
} = require("@ull-esit-pl/babel-plugin-left-side-support");
const foo = functionObject(function (bar, x) {
  return bar + x;
});
assign(foo, ["one", "two"], null, []);
console.log(foo(1, 2)); // 3
console.log(foo("grass", "hopper")); // grasshopper
console.log(foo("one", "two")); // null
console.log(foo("one")); // oneundefined