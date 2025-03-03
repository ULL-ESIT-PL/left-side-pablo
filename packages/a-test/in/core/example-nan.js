function @@ foo(bar) {
  return 1;
}
foo(Number("Im not a number")) = 2;
console.log(foo(Number("Me neither"))); // 2