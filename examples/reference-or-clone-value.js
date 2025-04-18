// What if the assigned value changes?
// Shall we choose reference or clone value?
// In JavaScript, when you assign an object to a variable, you are assigning a reference to that object.
// This means that if you change the object through one variable,
// the change will be reflected in all other variables that reference the same object.

function @@ double(bar) {
  return 2*bar;
}
let a = {x: 1};
double(4) = a;
console.log(double(4))      // { x: 1 }
a.x = 2;
console.log(double(4))      // { x: 2 }
