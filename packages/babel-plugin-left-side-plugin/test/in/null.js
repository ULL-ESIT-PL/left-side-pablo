function @@ foo(bar) {
  return bar * 2;
}
foo(null) = "changed";

console.log(foo(null)); //  "changed"
console.log(foo(5));  // 10