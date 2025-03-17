function @@ foo(bar) {
  return 0;
}

// Error.prototype.name and Error.message are not enumerable, but should be compared anyways.
let error1 = new Error("A normal error");
let error2 = new SyntaxError("A syntax error");
foo(error1) = 1;
console.log(foo(error1)); // 1
console.log(foo(error2)); // 0