const {
  assign,
  functionObject
} = require("@ull-esit-pl/babel-plugin-left-side-support");
const foo = functionObject(function (bar) {
  return bar;
});
let map1 = new Map();
map1.set("key1", "value1");
map1.set("key2", "value2");
let map2 = new Map();
map2.set("key1", "value1");
map2.set("key2", "value2");
assign(foo, [map1], "some other value", []);
console.log(foo(map2)); // "some other value"