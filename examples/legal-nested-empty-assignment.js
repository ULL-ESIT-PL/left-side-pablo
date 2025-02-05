function foo() {
  return function @@ bar(a) {
    return a + 2;
  }
}

foo()(6) = "Another value";
console.log(foo()(2)); // 4
console.log(foo()(4)); // "Another value"