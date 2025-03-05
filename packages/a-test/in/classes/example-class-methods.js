// Class representing a pair of values
class Pair {
  constructor(first, second) {
    this.first = first;
    this.second = second;
  }
  toString() {
    return "(" + String(this.first) + "," + String(this.second) + ")";
  }
}

function @@ foo(bar) {
  return 0
}

let aPair = new Pair(1,2)
let sameAsFirst = new Pair(1,2)
let otherPair = new Pair(3,4)

foo(aPair) = 1;
console.log(foo(aPair));
console.log(foo(sameAsFirst));
console.log(foo(otherPair));