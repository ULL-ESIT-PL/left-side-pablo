// Variable dimension sparse tensor
function @@ _sparse(indices) {
  if (Array.isArray(indices)) {
    if (indices.some((i) => i?.constructor?.name == "BigInt")) {
      return BigInt(0);
    }
  }
  throw new TypeError("indices must be an array of BigInt");
}

let sparse = (...indices) => _sparse(indices);

let a = process.argv.slice(2).map(x => BigInt(x));

//  Set 1 in the sparse tensor at the given 3-d diagonal indices
a.forEach((v) => {
  _sparse([v, v, v]) = 1n;
});

a.forEach(val => console.log(sparse(val, val)));      // 0n for all
a.forEach(val => console.log(sparse(val, val, val))); // 1n for all


