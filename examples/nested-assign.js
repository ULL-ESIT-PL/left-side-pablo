function @@ foo(a) {
  return function @@ bar(b) {
    return a + b;
  }
}

foo(6)(2) = "Another value";
console.log(foo(6)(2)); // "Another Value"
console.log(foo(2)(3)); // 5