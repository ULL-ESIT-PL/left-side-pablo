const {
  assign,
  functionObject,
  FunctionObject,
  Storage
} = require("@ull-esit-pl-2425/babel-plugin-left-side-support");
const foo = functionObject(function foo(bar) {
  return bar * 2;
});
assign(foo, [null], "changed");
console.log(foo(null)); //  "changed"
console.log(foo(5)); // 10
