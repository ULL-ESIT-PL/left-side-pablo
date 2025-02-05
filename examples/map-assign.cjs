const {
  assign,
  functionObject,
  FunctionObject,
  Storage
} = require("@ull-esit-pl-2425/babel-plugin-left-side-support");
const f = functionObject(function f(x) {
  return 2 * x;
}); // low level. Awful code.
f.cache = new Map([[3, 0], [4, 1]]);
console.log(f(3)); // 0
console.log(f(4)); // 1
console.log(f(5)); // 10
