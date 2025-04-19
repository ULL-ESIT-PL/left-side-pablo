const buffer = new ArrayBuffer(24);
const bigint64 = new BigInt64Array(buffer);
bigint64[0] = 5886014448488689n;
bigint64[1] = 1881938909131133n;
bigint64[2] = 1898875537769492n;

function @@ foo(bar) {
  return bar.at(-1);
}

foo(bigint64) = 1;

console.log(foo(bigint64)); // the hash library does not support typed arrays and throws an exception

