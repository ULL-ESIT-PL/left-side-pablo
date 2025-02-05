let a = {
  foo: function @@ f(x) { // f = fun(x) { fun(y) { x + y } },
    return function @@ g(y) {
      return x + y;
    }
  }
};

a.foo(2)(3) = "fighter";
console.log(a.foo(2)(3));  // "fighter"
console.log(a.foo(2)(5));  // 7
