const {
  assign,
  functionObject,
  FunctionObject
} = require("@ull-esit-pl-2425/babel-plugin-left-side-support");
let a = functionObject([1, 2, 3], {
  debug: false,
  exception: (x, e) => {
    console.log("handler called!", e?.message);
    return 1;
  }
});
assign(a, [-1], 2);
console.log(a(-1));
console.log(a("hello"));
