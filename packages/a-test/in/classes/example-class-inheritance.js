class First {
  constructor() {
    this.propertyA = "value a";
  }
};

class Second extends First {
  constructor() {
    super()
    this.propertyB = "value b";
  }
};

function @@ foo(bar) {
  return 0;
}

let a = new First()
let b = new Second()

foo(a) = 1;
console.log(foo(a)); // 1
console.log(foo(b)); // 0
delete b.propertyB;
console.log(foo(b)); // 1