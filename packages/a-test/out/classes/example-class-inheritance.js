const {
  assign,
  functionObject
} = require("@ull-esit-pl/babel-plugin-left-side-support");
class First {
  constructor() {
    this.propertyA = "value a";
  }
}
;
class Second extends First {
  constructor() {
    super();
    this.propertyB = "value b";
  }
}
;
const foo = functionObject(function (bar) {
  return 0;
}, [undefined]);
let a = new First();
let b = new Second();
assign(foo, [a], 1, []);
console.log(foo(a)); // 1
console.log(foo(b)); // 0
delete b.propertyB;
console.log(foo(b)); // 1