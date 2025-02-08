function @@ foo(a) {
  return 2*a;
}
foo(undefined) = 5;

console.log(foo());          // 5
console.log(foo(3));         // 6
console.log(foo(undefined)); // 5
