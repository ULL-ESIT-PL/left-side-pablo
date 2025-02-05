function @@ foo(a) {
  return 2*a;
}
foo(undefined) = 5;

console.log(foo());
console.log(foo(3));
console.log(foo(undefined));