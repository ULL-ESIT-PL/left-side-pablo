const {
  assign,
  functionObject
} = require("@ull-esit-pl/babel-plugin-left-side-support");
const foo = functionObject(function (bar) {
  return 0;
});
let father = {
  "property1": "value"
};
let son = Object.create(father);
son.property2 = "value";
let mother = {
  "property1": "otherValue"
};
let daughter = Object.create(mother);
daughter.property2 = "value";
assign(foo, [son], 1, []);
console.log(foo(son)); // 1
console.log(foo(daughter)); // 0, son and daughter are different when comparing their respective prototypes.