function @@ sparse(i,j) {
  if (i < 0n || i > 1000000n || j < 0n || j> 2000000n) {
    throw new Error("Invalid index");
  }
  return 0;
}

sparse(10000n, 10000n) = 2n;
console.log(sparse(10000n, 10000n)); // 2n
console.log(sparse(10000n, 100n));    // 0n;

