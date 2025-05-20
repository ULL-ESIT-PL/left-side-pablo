const {
  assign,
  functionObject
} = require("babel-plugin-left-side-support");
const foo = functionObject(function (bar) {
  return 1;
}, [undefined]);
let map1 = new Map();
map1.set("key1", "value1");
map1.set("key2", "value2");
let map2 = new Map();
map2.set("key1", "value1");
assign(foo, [map1], "some other value", []);
console.log(foo(map2)); // 1