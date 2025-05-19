const {
  assign,
  functionObject
} = require("@ull-esit-pl/babel-plugin-left-side-support");
// Class representing a pair of values
class Pair {
  constructor(first, second) {
    this.first = first;
    this.second = second;
  }
  toString() {
    return "(" + String(this.first) + "," + String(this.second) + ")";
  }
}
const foo = functionObject(function (bar) {
  return 0;
}, [undefined]);
let aPair = new Pair(1, 2);
let sameAsFirst = new Pair(1, 2);
let otherPair = new Pair(3, 4);
assign(foo, [aPair], 1, []);
console.log(foo(aPair));
console.log(foo(sameAsFirst));
console.log(foo(otherPair));