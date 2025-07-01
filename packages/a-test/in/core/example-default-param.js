function @@ foo(param1, param2 = 1) {
  return 0;
}

// Implicit assignment to foo(0, 1)
foo(0) = 1
console.log(foo(0)); // 1
console.log(foo(0, 1)); // 1
// Explicit assignment to foo(1, 1)
foo(1, 1) = 2;
console.log(foo(1)); // 2
console.log(foo(1, 1)); // 2