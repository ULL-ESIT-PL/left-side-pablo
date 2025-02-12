function @@ foo(bar) {
  return 1;
}

let arr1 = [1,2,3];
let arr2 = [1,2,3];
let arr3 = [2,3,4];
foo(arr1) = "some other value";
console.log(foo(arr2)); // "some other value"
console.log(foo(arr3)); // 1