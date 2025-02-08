function @@ foo(a, b) {
    //console.log(a, b);
    return a + b;
}

foo(1, undefined) = "Something else";
console.log(foo(1, undefined)); // "Something else"
console.log(typeof foo(1)); // function
console.log(typeof foo(undefined)); // function
