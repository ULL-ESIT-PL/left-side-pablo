// To use with the object store
// Execute with  npx babel map-assign.js | STOREOBJECT=true node 
const f = functionObject(function f(x) {
  return 2 * x;
}); 
f.cache = new Storage([[3, 0], [4, 1]]);
console.log(f(3)); // 0
console.log(f(4)); // 1
console.log(f(5)); // 10
