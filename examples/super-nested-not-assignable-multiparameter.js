function foo(x, y) {
    return function @@ bar(z,w) {
        return x + y + z+ w;
    }
}

// TODO: This is not working as expected. TypeError: f.getCache is not a function
foo("one", "two")("three", "four") = "another thing";

console.log(foo(1, 2)(3, 4)); // 10
console.log(foo("one", "two")("three", "four")); // "another thing"

