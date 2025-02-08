const {
  assign,
  mAssign,
  functionObject,
  FunctionObject,
  Storage
} = require("@ull-esit-pl/babel-plugin-left-side-support");
const foo = functionObject(function foo(bar, x) {
  return bar + x;
});
mAssign(foo, [["one", "two"]], null);
console.log(foo(1, 2)); // 3

console.log(foo("grass", "hopper")); // grasshopper
console.log(foo("one", "two")); // null
console.log(typeof foo("one")); // function
