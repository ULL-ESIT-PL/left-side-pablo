function @@ foo(bar) {
  return bar;
}

let arr1 = [1,2,3];
let arr2 = [1,2,3];
foo(arr1) = "some other value";
console.log(foo(arr2)); // "some other value"