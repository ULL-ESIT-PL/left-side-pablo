// Arrays
let a = functionObject([1,2,3]); // Potential Syntax @@ [1,2,3]
console.log(a(0));  // 1
console.log(a(2));  // 3
console.log(a(3));  // undefined
console.log(a(-1)); // 3
try { a("chuchu") } catch (e) { console.log(e.message) }; // 1 number of arguments
a(0) = -3;
console.log(a(0));   // -3
a(2) = 0;
console.log(a(2));   // 0
console.log(a.size); // 2
a.setCache(9,1);
console.log(a(9));   // 1
console.log(a.getCache(9));   // 1

