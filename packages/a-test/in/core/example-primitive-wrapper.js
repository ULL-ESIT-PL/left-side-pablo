/* When calling the constructor of one of JavaScript's primitive types with 'new', a wrapper object
   will be returned instead of the literal value. I expect the value to be unwrapped when assigning to
   the assignable function */

function @@ foo(bar) {
  return 0;
}
let wrapper = new Number(13);
foo(wrapper) = 1;
console.log(foo(13)) // 1
console.log(foo(wrapper)) // 1

let otherWrapper = new Number(7);
console.log(foo(otherWrapper)); // 0