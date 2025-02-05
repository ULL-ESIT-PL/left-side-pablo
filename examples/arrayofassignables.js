// TODO: Implement assignable arrow functions
let a = [
  function @@a(x) { return x + 1},
  function @@b(y) { return 2*y },
];

a[0](1) = 3;
console.log(a[0](1)); // 3
console.log(a[0](5)); // 6

a[1](2) = 4;
console.log(a[1](2)); // 4
console.log(a[1](3)); // 6