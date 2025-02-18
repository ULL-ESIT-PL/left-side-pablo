function @@ foo(bar) {
  return 1;
}

let set1 = new Set([1, 2, 3]);
let set2 = new Set([1, 2]);
foo(set1) = "some other value";
console.log(foo(set2)); // 1