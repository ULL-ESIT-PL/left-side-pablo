/* When calling the constructor of one of JavaScript's primitive types with 'new', a wrapper object
   will be returned instead of the literal value. I expect the value to be unwrapped when assigning to
   the assignable function
   
   Note: This is not really the normal JS behaviour, so maybe it shouldn't be a feature.
   Let us say that we have "let num = new Number(1)"
   If we try num == 1, JS will return true, but because Object (besides null) are truthy values.
   If we try num === 1, JS will return false.
   Because of this, moving it into experimental
   */

function @@ foo(bar) {
  return 0;
}
let wrapper = new Number(13);
foo(wrapper) = 1;
console.log(foo(13)) // 1
console.log(foo(wrapper)) // 1

let otherWrapper = new Number(7);
console.log(foo(otherWrapper)); // 0