const {
  assign,
  functionObject
} = require("babel-plugin-left-side-support");
const foo = functionObject(function (bar) {
  return 0;
}, [undefined]);
let firstObj = {
  someProperty: "someValue"
};
firstObj["myself"] = firstObj;
let secondObj = {
  someProperty: "someValue"
};
secondObj["myself"] = secondObj;
assign(foo, [firstObj], 1, []);
console.log(foo(secondObj));
// Both object are not strictly the same, but the structure and values are similar enough to consider them equal.
// Is "someProperty" in firstObj the same as the secondObj? Yes
// Is "myself" in firstObj the same as the secondObj? Only if the object they are referencing are the same.
// Is "someProperty"...
// Because both values of myself have been compared before we are detecting a cycle, therefore we can stop comparing both values.
// The expected value is 1