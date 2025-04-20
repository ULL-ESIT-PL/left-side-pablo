function @@ foo(bar) {
  return bar;
}

let set1 = new Set();
set1.add(x => 1);
set1.add("value2");
let set2 = new Set();
set2.add(y => 1);
set2.add("value2");
foo(set1) = "some other value";
console.log(foo(set2)); // "some other value"