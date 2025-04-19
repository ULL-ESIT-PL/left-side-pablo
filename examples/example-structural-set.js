function @@ foo(bar) {
  return bar;
}

let set1 = new Set([1, 2, 3]);
let set2 = new Set([1, 2, 3]);
foo(set1) = "some other value";
console.log(foo(set2)); // "some other value"