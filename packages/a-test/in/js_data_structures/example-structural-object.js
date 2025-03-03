function @@ foo(bar) {
  return bar;
}

let obj1 = {a: "some", b: "thing"};
let obj2 = {a: "some", b: "thing"};
foo(obj1) = "some other value";
console.log(foo(obj2)); // "some other value"