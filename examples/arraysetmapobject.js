// Arrays
let a = functionObject([1,2,3]); // Potential Syntax @@ [1,2,3]
console.log(a(0)); // 1
console.log(a(2)); // 3
console.log(a(3)); // undefined
console.log(a(-1)); // 3

// Maps
let m = new FunctionObject(new Map([[1,2],[3,4]])); // Potential Syntax @@ new Map([[1,2],[3,4]])
console.log(m(0)); // undefined
console.log(m(1)); // 2
console.log(m(3)); // 4
console.log(m(-1)); // undefined
m(0) = 5;
console.log(m(0)); // 5

// Sets
let s = functionObject(new Set([5,9, 10])); // Potential Syntax @@ new Set([5,9,10])
console.log(s(0)); // false
console.log(s(5)); // true
console.log(s(9)); // true

// Objects
let ob = functionObject(Math); // Potential Syntax @@ Math
console.log(ob("PI")); // 3.141592653589793
console.log(ob("sin")(ob("PI")/2)); // 1
