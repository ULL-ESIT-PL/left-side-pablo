function @@ foo(a) {
  return function bar(b) { // bar is not assignable
    return a + b;
  }
}

//foo(4) = 9; // correct
foo(6)(2) = -1; // raise a TypeError 'foo(6) is not assignable'
console.log(foo(2)(3)); // 5