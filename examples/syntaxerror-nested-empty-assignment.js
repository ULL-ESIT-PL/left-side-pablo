function @@ foo(a) {
  return function @@ bar() {
    return a + 2;
  }
}

foo(6)() = "Another value";
console.log(foo(2)());
console.log(foo(6)()); 