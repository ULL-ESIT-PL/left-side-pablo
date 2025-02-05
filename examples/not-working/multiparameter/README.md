## Opinions on multiparameters

@crguezl believes that multiparameters must not be supported for assignable `@@` functions.
Instead  `f(a,b,c)` will be a synonymous for `f(a)(b)(c)`.

An assignable `@@` function must be a function that takes a single parameter.

Thus, s.t. like:


```js 
function @@ foo(a, b, c) {
    return a + b + c;
}

console.log(foo(1, 2, 3)) // same as foo(1)(2)(3) = 6
console.log(foo(1, 5, 3)) // same as foo(1)(5)(3) = 9
```

In the future must produce the curried version of `foo`:

```js
function @@ foo(a) {
    return @@ function(b) {
        return @@ function(c) {
            return a + b + c;
        }
    }
}
```

Currently it must produce a syntax error.