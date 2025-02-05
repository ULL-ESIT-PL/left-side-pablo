let a = functionObject(  // a = [1, 2, 3, else ... catch (x, e, p)]
  [1,2,3], { // A functionObject array produces exceptions when the index is not a number
    debug: false,
    undef: (x, primitive) => { // primitive is the array [1,2,3]
      throw new Error("Error accesing index '" + x + "' in array "+ JSON.stringify(primitive)); 
    },
    exception: (x, e, primitive) => { 
      if (typeof x === 'string' && primitive[x] !== undefined) {
        return primitive[x]; 
      } else
      if (Array.isArray(x)) {
        return x.map(i => a(i));
      } else throw e;
  }}
); 
console.log(a([2, 1, 0, -1, -2, -3])); // [ 3, 2, 1, 3, 2, 1 ]
console.log(a(-1)); // 3 the function object of "a" behaves as "a.at"
try { console.log(a(9)) } catch (e) { console.log(e.message) }; // Error accesing index '9' in array [1,2,3]
console.log(a("length")); // 3
