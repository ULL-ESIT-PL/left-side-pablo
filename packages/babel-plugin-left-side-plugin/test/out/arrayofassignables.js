const {
  assign,
  mAssign,
  functionObject,
  FunctionObject,
  Storage
} = require("@ull-esit-pl/babel-plugin-left-side-support");
// TODO: Implement assignable arrow functions
let a = [functionObject(function a(x) {
  return x + 1;
}), functionObject(function b(y) {
  return 2 * y;
})];
mAssign(a[0], [1], 3);
console.log(a[0](1)); // 3
console.log(a[0](5)); // 6

mAssign(a[1], [2], 4);
console.log(a[1](2)); // 4
console.log(a[1](3)); // 6