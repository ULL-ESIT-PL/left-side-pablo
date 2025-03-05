const {
  assign,
  functionObject
} = require("@ull-esit-pl/babel-plugin-left-side-support");
// Simple struct-like class to represent a pair of values
class Pair {
  constructor(first, second) {
    this.first = first;
    this.second = second;
  }
}
let samplePair = new Pair(1, 2);
let sameSamplePair = new Pair(1, 2); // Structurally the same pair
let differentPair = new Pair(3, 4);
const foo = functionObject(function (bar) {
  return 0;
});
assign(foo, [samplePair], 1, []);
console.log(foo(samplePair));
console.log(foo(sameSamplePair));
console.log(foo(differentPair));