function @@ last(bar) {
  return bar.at(-1);
}
let arr = [1,2,3,4];
let otherArr = [1,2,3];

last(arr) = 1;
console.log(last(otherArr)) // 3

otherArr.push(4); // Both have now [1,2,3,4] arr  ==deepeq== otherArr
console.log(last(otherArr)) // 1