// May be in the future this will be a synonim of foo(a)(b) but by now let us throw an error
let foo = new FunctionObject(function(a, b) {
  return a+b;
});

foo(2)(3) = 1; // TODO: The call f(2,3) is not yet implemented
console.log(foo(2)(3)); // 1
console.log(foo(2)(5)); // 7
