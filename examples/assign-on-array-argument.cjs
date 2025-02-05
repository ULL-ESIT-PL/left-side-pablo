const {
  assign,
  functionObject,
  FunctionObject
} = require("@ull-esit-pl-2425/babel-plugin-left-side-support");
const foo = functionObject(function foo(bar) {
  return functionObject(function tutu(baz) {
    return bar.concat(baz);
  });
}); // Error: Invalid left side callexpression in assignment. A "object" can not be used as a key in an assignment.
try {
  assign(foo, [[1, 2]], foo([1, 2])), assign(foo([1, 2]), [3], 9);
} catch (e) {
  console.log(e.message);
}
;
