const {
  assign,
  functionObject,
  FunctionObject
} = require("@ull-esit-pl-2425/babel-plugin-left-side-support");
let a = functionObject([1, 2, 3], {
  // A functionObject array produces exceptions when the index is not a number
  debug: false,
  exception: (x, e) => {
    console.log("handler called!", e?.message);
    if (typeof x === 'string') {
      return x.length;
    } else if (Array.isArray(x)) {
      return x.map(i => a(i));
    }
  }
});
console.log(a("hello")); // 5
console.log(a([2, 1, 0, -1, -2, -3])); // [ 3, 2, 1, 3, 2, 1 ]
