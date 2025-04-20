const buffer = new ArrayBuffer(24);
const uint8arr = new BigInt64Array(buffer);
uint8arr[0] = 5886014448488689n;
uint8arr[1] = 1881938909131133n;
uint8arr[2] = 1898875537769492n;

function @@ foo(bar) {
  return bar.at(-1);
}

foo(uint8arr) = 1;

console.log(foo(uint8arr)); // the hash library does not support typed arrays and throws an exception

