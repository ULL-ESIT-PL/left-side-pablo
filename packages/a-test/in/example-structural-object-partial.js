function @@ foo(bar) {
  return 1;
}

let obj1 = {a: "some"};
let obj2 = {a: "some", b: "thing"};
foo(obj1 @@) = "some other value"; // Partial match syntax
console.log(foo(obj2)); // "some other value"