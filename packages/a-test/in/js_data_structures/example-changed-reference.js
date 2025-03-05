function @@ foo(bar) {
  return 0;
}
let arr = [1,2,3,4]
let otherArr = [1,2,3]
foo(arr) = 1;
console.log(foo(otherArr)) // 0, default behaviour
arr.pop(); // arr === [1,2,3] === otherArr
console.log(foo(otherArr)) // 0, the reference was changed but was assigned to a certain structure