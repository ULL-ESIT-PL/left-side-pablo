// TODO: instead of setCache use another method not conflicting with mAssign and assign
// Arrays
let a = functionObject([1,2,3]); // Potential Syntax @@ [1,2,3]

// With Map: line 5 TypeError: Invalid left side callexpression in assignment. A "Map" can not be used as a key in a left-side function assignment.
try { a.setCache(new Map([[3,1],[4,2],[5,3]])); } catch (e) { console.log("line 5", e.message); } 
console.log(a(3));   // undefined
console.log(a.getCache(4));   // undefined

// With Array [ [pairs] ... [pairs] ]
try { a.setCache([[5,1],[6,2],[7,3]]); } catch (e) { console.log("line 10", e.message); }
console.log(a(5));   // undefined
console.log(a.getCache(6));   // undefined

// Invalid left side callexpression in assignment. An "Array" can not be used as a key in an assignment.
try {
  a.setCache([7,1],[8,2]);
} catch (e) {
   console.log(e.message);
}
try { a.setCache(new Map([[[7,1], [8,2]]])); } catch (e) { console.log("line 20", e.message); }
try { console.log(a([7, 1])); } catch (e) { console.log("line 21", e.message); } // Index "7,1" is not an integer
