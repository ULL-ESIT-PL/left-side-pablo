function @@ foo(bar, x) {
    return bar + x;
}

//foo("one", "two") = null;
foo("one", "two") = null

console.log(foo(1, 2)); // 3
//console.log(foo(1)(2)); // 3

//console.log(foo("grass", "hopper")); // grasshopper
//console.log(foo("one", "two")); // null
console.log(foo("one")("two")); // null
//console.log(foo("one")); // oneundefine
// d
