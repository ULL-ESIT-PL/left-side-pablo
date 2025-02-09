const {
  assign,
  mAssign,
  functionObject,
  FunctionObject,
  Storage
} = require("@ull-esit-pl/babel-plugin-left-side-support");
const foo = functionObject(function foo(bar) {
  debugger;
  return functionObject(function tutu(baz) {
    console.log(typeof bar);
    return bar.concat(baz);
  });
}); // Semantic decision: references are not allowed as keys in a function assignment
// Error: Invalid left side callexpression in assignment. A "object" can not be used as a key in an assignment.
try {
  mAssign(foo, [[[1, 2]], 3], 9);
} catch (e) {
  console.log(e.message);
}
;
