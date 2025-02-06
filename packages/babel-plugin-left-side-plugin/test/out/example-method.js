const {
  assign,
  functionObject
} = require("@ull-esit-pl/babel-plugin-left-side-support");
let a = {
  foo: functionObject(function (a) {
    return a;
  })
};
assign(a.foo, ["bar"], "fighter");
console.log(a.foo("x")); // x
console.log(a.foo("bar")); // fighter