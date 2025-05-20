const {
  assign,
  functionObject
} = require("babel-plugin-left-side-support");
const foo = functionObject(function (a, b, c, d) {
  return 1;
}, [undefined, undefined, undefined, undefined]);
assign(foo, [1, [1, 2, 3], 4, 5], "other", []);
console.log(foo(1, [1, 2, 3], 4, 5)); // "other"
console.log(foo(1, [1, 2], 4, 5)); // 1
console.log(foo(1, [1, 2, 3], 4, 6)); // 1, fallbacks properly to default function