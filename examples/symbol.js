let a = Symbol('a');
function @@ foo(bar) {
  return 0;
}

foo(a) = 1;
console.log(foo(a)); // 1
console.log(foo(Symbol('a'))); // 0
console.log(foo(Symbol.for('a'))); // 0
console.log(foo(Symbol.for('b'))); // 0