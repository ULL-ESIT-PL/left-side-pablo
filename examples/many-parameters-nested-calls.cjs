const {
  assign,
  functionObject,
  FunctionObject
} = require("@ull-esit-pl-2425/babel-plugin-left-side-support");
// May be in the future this will be a synonim of foo(a)(b) but by now let us throw an error
let foo = new FunctionObject(function (a, b) {
  return a + b;
});
assign(foo, [2], foo(2)), assign(foo(2), [3], 1); // The call f(2,3) is not yet implemented
console.log(foo(2)(3)); // 1
console.log(foo(2)(5)); // 7
