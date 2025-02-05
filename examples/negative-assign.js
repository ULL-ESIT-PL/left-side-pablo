let a = functionObject(
  [1,2,3], {
    debug: false,
    exception: (x, e) => {   
      throw new Error("Error accesing index '" + x + "' in array "+ e);
  }}
); 
a(-1) = 2;  // 3
console.log(a(-1));
try { console.log(a(9)); } catch (e) { console.log(e) };
