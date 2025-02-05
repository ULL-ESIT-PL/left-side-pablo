const {
  assign,
  functionObject,
  FunctionObject
} = require("@ull-esit-pl-2425/babel-plugin-left-side-support");
const foo = functionObject(function foo(bar) {
  return bar * 2;
});
console.log(typeof foo); //  function
console.log(foo instanceof FunctionObject); //  [class FunctionObject extends CallableInstance]

console.log(foo.size); //  0

assign(foo, [10], 5);
console.log(foo.size); //  1

console.log(foo.cache.store instanceof Map || Object.getPrototypeOf(foo.cache.store) === null);
