function @@ last(bar) {
  return bar.at(-1);
}
let arr = [1,2,3,4];
let otherArr = [1,2,3,4];
console.log(last(arr))      // 4
last(arr) = 1;
console.log(last(arr))      // 1
console.log(last(otherArr)) // 1 since otherArr ==deepeq== arr
otherArr.push(5); // now  arr  !==deepeq== otherArr
console.log(last(otherArr)) // 5