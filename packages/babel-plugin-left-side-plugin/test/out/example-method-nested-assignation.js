const {
  assign,
  mAssign,
  functionObject,
  FunctionObject,
  Storage
} = require("@ull-esit-pl/babel-plugin-left-side-support");
let a = {
  foo: functionObject(function f(x) {
    // f = fun(x) { fun(y) { x + y } },
    return functionObject(function g(y) {
      return x + y;
    });
  })
};
mAssign(a.foo, [2, 3], "fighter");
console.log(a.foo(2)(3)); // "fighter"
console.log(a.foo(2)(5)); // 7