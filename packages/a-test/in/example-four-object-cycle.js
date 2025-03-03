function @@ foo(bar) {
  return 0;
}

let fourthObj = {}
let thirdObj = {
  ref: fourthObj
}
let secondObj = {
  ref: thirdObj
}
let firstObj = {
  ref: secondObj
};
let equalToFirstObj = {
  ref: secondObj
};
fourthObj["ref"] = firstObj

foo(firstObj) = 1;
console.log(foo(equalToFirstObj)); 