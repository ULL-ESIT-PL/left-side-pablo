function @@ foo(bar) {
  return 1;
}

let map1 = new Map();
map1.set("key1", "value1");
map1.set("key2", "value2");
let map2 = new Map();
map2.set("key1", "value1");
foo(map1) = "some other value";
console.log(foo(map2)); // 1