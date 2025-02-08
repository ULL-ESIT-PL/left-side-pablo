const {
  assign,
  mAssign,
  functionObject,
  FunctionObject,
  Storage
} = require("@ull-esit-pl/babel-plugin-left-side-support");
const foo = functionObject(function foo(bar, x) {
  return bar + x;
}); //foo("one", "two") = null;
mAssign(foo, [["one", "two"]], null);
console.log(foo(1, 2)); // 3
//console.log(foo(1)(2)); // 3

//console.log(foo("grass", "hopper")); // grasshopper
//console.log(foo("one", "two")); // null
console.log(foo("one", "two")); // null
//console.log(foo("one")); // oneundefine
// d
