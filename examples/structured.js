function @@ f(x) {
  return 0;
}

f([1, 2, 3]) = 1;
console.log(f([1, 2, 3]));    // 1
console.log(f([1, 2, 3, 4])); // 0