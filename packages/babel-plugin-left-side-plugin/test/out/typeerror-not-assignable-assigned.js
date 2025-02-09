const {
  assign,
  mAssign,
  functionObject,
  FunctionObject,
  Storage
} = require("@ull-esit-pl/babel-plugin-left-side-support");
function foo(bar) {
  return bar * 2;
}
mAssign(foo, [10], 5); // Must produce 'TypeError: function "foo" is not assignable.'
console.log(foo(10));
