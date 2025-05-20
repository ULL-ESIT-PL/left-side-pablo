const {
  assign,
  functionObject
} = require("babel-plugin-left-side-support");
let a = {
  foo: functionObject(function (a) {
    return a;
  }, [undefined])
};
assign(a.foo, ["bar"], "fighter", []);
console.log(a.foo("x")); // x
console.log(a.foo("bar")); // fighter