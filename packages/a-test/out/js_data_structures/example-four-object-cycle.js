const {
  assign,
  functionObject
} = require("@ull-esit-pl/babel-plugin-left-side-support");
const foo = functionObject(function (bar) {
  return 0;
}, [undefined]); // Fails when using hash. Hashes:
// object:1:string:3:ref:object:1:string:3:ref:object:1:string:3:ref:object:1:string:3:ref:string:12:[CIRCULAR:0],,,,
// object:1:string:3:ref:object:1:string:3:ref:object:1:string:3:ref:object:1:string:3:ref:object:1:string:3:ref:string:12:[CIRCULAR:1],,,,,
// In [CIRCULAR:1], the number stands for a counter: the number of evaluated object. This is the way object-hash deals with circular references.
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