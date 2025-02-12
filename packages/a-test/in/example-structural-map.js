function @@ foo(bar) {
  return bar;
}

let map1 = new Map();
map1.set("key1", "value1");
map1.set("key2", "value2");
let map2 = new Map();
map2.set("key1", "value1");
map2.set("key2", "value2");
foo(map1) = "some other value";
console.log(foo(map2)); // "some other value"