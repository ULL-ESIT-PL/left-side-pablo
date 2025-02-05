const {
  assign,
  functionObject,
  FunctionObject
} = require("@ull-esit-pl-2425/babel-plugin-left-side-support");
const foo = functionObject(function foo(bar) {
  return functionObject(function tutu(baz) {
    return bar.concat(baz);
  },{  debug: true });
});
a = [1, 2];
assign(foo, [a], foo(a)), 
assign(foo(a), [3], 9);
console.log(foo([1, 2])(3)); //  [ 1, 2, 3 ]
console.log(foo(a)(3)); //  9
console.log(foo([5])([6])); // [5, 6]
