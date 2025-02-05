function @@ foo(c, d) {
  return function @@ bar(a) {
    return a + c + d;
  }
}

foo(1, 3)(6) = "Another value";
console.log(foo(2, 3)(5)); // 4
console.log(foo(1, 3)(6)); // "Another value"