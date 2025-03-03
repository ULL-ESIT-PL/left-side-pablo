const {
  assign,
  functionObject
} = require("@ull-esit-pl/babel-plugin-left-side-support");
const foo = functionObject(function (bar) {
  return 0;
});
let fourthObj = {};
let thirdObj = {
  ref: fourthObj
};
let secondObj = {
  ref: thirdObj
};
let firstObj = {
  ref: secondObj
};
let equalToFirstObj = {
  ref: secondObj
};
fourthObj["ref"] = firstObj;
assign(foo, [firstObj], 1, []);
console.log(foo(equalToFirstObj));