let a = functionObject(
  [3, 2, 1], {
    debug: false,
    exception: (x, e, primitive) => { 
      if ((typeof x == "string") && primitive[x] !== undefined) {
        return primitive[x];
      } else throw e;
  }}
); 
a(-1) = 2;  
console.log(a(-1)); // 2
console.log(a("length")); // 3
a(3) = 4;
console.log(a("length")); // 3 since "primitive" has not changed
console.log(a.cache.size); // 2
console.log(a.cache.toString()); // [[-1,2],[3,4]]