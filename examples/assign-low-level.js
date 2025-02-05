function @@f(x) {
  return 2*x;
}
// TODO: Get rid of the obsolete brackets around the argument!
assign(f, [3], 0);  // TODO: assign can receive a map as only second argument
console.log(f(3)); // 0
console.log(f(4)); // 8