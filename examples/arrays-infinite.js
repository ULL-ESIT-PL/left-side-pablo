function @@ last(bar) {
  return bar.at(-1);
}
let arr = [x => x, 5];
let otherArr = [y => y, 5];
console.log(last(arr))      // 5
last(arr) = 1;
console.log(last(arr))      // 1
console.log(last(otherArr)) // ?? 5
