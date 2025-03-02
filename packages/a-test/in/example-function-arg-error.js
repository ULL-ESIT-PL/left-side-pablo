function @@ foo(bar) {
  return 1;
}

foo(function () {return null}) = 0;
console.log(foo(function () {return null})); // Not the same function, they don't share the same reference. Expect 1