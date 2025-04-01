function @@ foo(bar) {
  return 0;
}

let firstBigInt = 1000000000000000000000000000000000000n;
let firstBigIntCopy = 1000000000000000000000000000000000000n;
let secondBigInt = 1000000000000000000000000000000000001n;
foo(firstBigInt) = 1;
console.log(foo(firstBigInt)); // 1
console.log(foo(firstBigIntCopy)); // 1
console.log(foo(secondBigInt)); // 0