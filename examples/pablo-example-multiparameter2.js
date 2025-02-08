function @@ foo(x, y) {
    return function @@ bar(z,w) {
        return x + y + z+ w;
    }
}

foo("one", "two")("three", "four") = null;
//foo("one")("two") = null

console.log(foo(1, 2)(3, 4)); // 10
//console.log(foo(1)(2)); // 3

//console.log(foo("grass", "hopper")); // grasshopper
//console.log(foo("one", "two")); // null
//console.log(foo("one")("two")); // null
//console.log(foo("one")); // oneundefine

