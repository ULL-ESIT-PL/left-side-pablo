const uint8arr = new Uint8Array(3);
uint8arr[0] = 42;
uint8arr[1] = 2;
uint8arr[2] = 1;

function @@ foo(bar) {
  return bar.at(-1);
}

foo(uint8arr) = 1;

console.log(foo(uint8arr)); // 1: The hash library does support uint8arr arrays

