const {
  assign,
  mAssign,
  functionObject,
  FunctionObject,
  Storage
} = require("@ull-esit-pl-2425/babel-plugin-left-side-support");
// Arrays
let a = functionObject([1, 2, 3]); // Potential Syntax @@ [1,2,3]

// With Map
try {
  a.setCache(new Map([[3, 1], [4, 2], [5, 3]]));
} catch (e) {
  console.log(e.message);
}
console.log(a(3)); // 1
console.log(a.getCache(4)); // 2

// With Array [ [pairs] ... [pairs] ]
try {
  a.setCache([[5, 1], [6, 2], [7, 3]]);
} catch (e) {
  console.log(e.message);
}
console.log(a(5)); // 1
console.log(a.getCache(6)); // 2

// Invalid left side callexpression in assignment. An "Array" can not be used as a key in an assignment.
try {
  a.setCache([7, 1], [8, 2]);
} catch (e) {
  console.log(e.message);
}
a.setCache(new Map([[[7, 1], [8, 2]]])); // Same as a([7, 1]) = [8, 2]
console.log(a([7, 1])); // [8, 2]
