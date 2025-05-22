<p align="center">
  <a href="https://babeljs.io/">
    <img alt="babel" src="https://raw.githubusercontent.com/babel/logo/master/babel.png" width="546">
  </a>
</p>

## What is this?

> [!CAUTION]
> This is a work in progress. The syntax and the semantic of the extension to JavaScript presented below is not yet fully defined and tested. The [packages](https://github.com/orgs/ULL-ESIT-PL/packages?repo_name=babel-tanhauhau) are published in the GitHub registry, but they are not ready for production.

> [!CAUTION]
> This package contains only the support code of the extension. It can not be used in a standalone fashion and should be only used as a dependency of the plugin `babel-left-side`.


This is a fork of [tanhauhau/babel](https://github.com/tanhauhau/babel) which is a fork of the original Babel repo at version 7.10.  
The fork is being written by Pablo Santana inside the GitHub organization [ull-esit-pl](https://github.com/ULL-ESIT-PL/) as part of his Bachellor Thesis (Trabajo Fin de Grado).

The fork is formed by three packages that extend the JavaScript language with a new kind of functions. The packages are:

- The JS parser modified: [parser-left-side](https://www.npmjs.com/package/parser-left-side)
- The AST transformation plugin: [babel-plugin-left-side](https://www.npmjs.com/package/babel-plugin-left-side) 
- The support library: [babel-plugin-left-side-support](https://www.npmjs.com/package/babel-plugin-left-side-support) 

### The proposed Syntax and Semantic

These packages extend JS with a new kind of functions, the *assignable functions*. Here is an example of a declaration:

```js 
function @@ foo(bar) {
  return bar * 2;
}
```

These *assignable* functions can be later modified  using the assign expression:

```js
foo(10) = 5;
```

Here is the full code for our "hello assignable functions!" left-side-plugin example:

`➜  babel-npm-test git:(main) cat example.js`
```js
function @@ foo(bar) {
  return bar * 2;
}
foo(10) = 5;

console.log(foo(10)); //  5
console.log(foo(5));  // 10
```

### Features
- Multiple parameters assignment (no spread operator `...`).
- Allows default parameters.
```js
function @@ foo(param1, param2 = 1) {
  return 0;
}

// Implicit assignment to foo(0, 1)
foo(0) = 1
console.log(foo(0)); // 1
console.log(foo(0, 1)); // 1
// Explicit assignment to foo(1, 1)
foo(1, 1) = 2;
console.log(foo(1)); // 2
console.log(foo(1, 1)); // 2
```
- Also works with methods and static methods.
```js
class Foo() {
  @@ assignableMethod(param) {
    // ...
  }
  static @@ assignableStaticMethod(param) {
    // ...
  }
}
```
- Structural equality semantics for objects (doesn't take into consideration the prototype or constructor and at the moment throws exceptions when receiving functions or objects containing cycles).
```js
function @@ foo(bar) {
  return bar;
}

let obj1 = {a: "some", b: "thing"};
let obj2 = {a: "some", b: "thing"};
foo(obj1) = "some other value";
console.log(foo(obj2)); // "some other value"
// Also works with Map, Set and RegExp!
let set1 = new Set([1, 2, 3]);
let set2 = new Set([1, 2, 3]);
foo(set1) = "some other value";
console.log(foo(set2)); // "some other value"
```


## Installation

Here are the node and npm versions I have used to test the packages:

```bash
➜  babel-npm-test node --version
v20.5.0
➜  babel-npm-test npm --version
9.8.0
```

Install Babel. The extension was developed using Babel 7.10 but newer versions have worked so far.

```
npm i -D @babel/cli
```

Install the package `babel-left-side`

```
npm i -D babel-left-side 
```

Your package.json `devDependencies` section will look similar to this:

```json
{
  "@babel/cli": "latest",
  "babel-plugin-left-side": "latest",
}
```


## Compiling the code

To compile the example above add a `babel.config.js` to your workspace folder:

`➜  babel-npm-test git:(main) cat babel.config.js`
```js
module.exports = {
  "plugins": [
    "babel-plugin-left-side-plugin"
  ],
}
```

and then compile it using the installed packages:

```js
➜  babel-npm-test npx babel example.js
```
This will output the compiled code to the console:

```js                                                      
const {
  assign,
  functionObject
} = require("babel-plugin-left-side-support");
const foo = functionObject(function (bar) {
  return bar * 2;
}, [undefined]);
assign(foo, [10], 5);
console.log(foo(10));
console.log(foo(5));
```

If you want to save it to a file, use the `-o` option.

## Running

You can pipe the output to `node`:

```bash
➜  babel-npm-test npx babel  example.js | node  -
5
10
```

or alternatively, use the `-o` option to save the output to a file and then run it:

```
➜  babel-left-side-npm-test git:(main) npx babel  example.js -o example.cjs
➜  babel-left-side-npm-test git:(main) ✗ node example.cjs 
5
10
```

## References

- Our tutorial on babel: https://github.com/ULL-ESIT-PL/babel-learning/tree/main
- Section of the former tutorial describing how the packages were published: https://github.com/ULL-ESIT-PL/babel-learning/blob/main/doc/building-publishing.md
- Branch object-hash with the actual code implementation: https://github.com/ULL-ESIT-PL/left-side-pablo/tree/object-hash
- Branch pablo-tfg with the earlier code implementation: https://github.com/ULL-ESIT-PL/babel-tanhauhau/tree/pablo-tfg
- The original idea of the project is based on what is explained in this draft: https://www.authorea.com/users/147476/articles/1235078-function-expressions-on-the-left-side-of-assignments (submitted now to Science of Computer Programming
 journal)

## License

Same as Babel itself: [MIT](LICENSE)
