// File containing equality functions for object comparison.

// Full match between two objects
function checkStructuralEquality(obj1, obj2) {
  let toCheckForEqualityObj1 = [obj1],
      toCheckForEqualityObj2 = [obj2];
  while (toCheckForEqualityObj1.length != 0) {
    obj1 = toCheckForEqualityObj1.pop();
    obj2 = toCheckForEqualityObj2.pop();
    if (obj1 === null || obj2 === null) {
      if (obj1 === obj2) { // Both null
        continue;
      } else {
        return false;
      }
    }
    if (typeof obj1 !== typeof obj2 || Object.keys(obj1).length !== Object.keys(obj2).length) { // Check for same type and same number of properties
      return false;
    }
    if (typeof obj1 !== "object") {
      if (obj1 === obj2) { // Primitive with same value
        continue;
      } else {
        return false;
      }
    }
    for (let key in obj1) {
      if (!key in obj2) return false;
      toCheckForEqualityObj1.push(obj1[key]);
      toCheckForEqualityObj2.push(obj2[key]);
    }
    if (!(obj1 instanceof Array) && obj1.entries !== undefined) { // Avoid Array since properties of an Array are already checked and creating another Array will eventually cause a stack error.
      toCheckForEqualityObj1.push(Array.from(obj1.entries()).sort((a, b) => a[0] - b[0])); // Sorting to assert that the entries are in the same order in both objects.
      toCheckForEqualityObj2.push(Array.from(obj2.entries()).sort((a, b) => a[0] - b[0]));
    }
  }
  return true;
}

function checkPartialStructuralEquality(obj1, obj2) {
  if (obj1 === null || obj2 === null) return obj1 === obj2;
  if (typeof obj1 !== typeof obj2) {
    return false;
  }
  if (typeof obj1 !== "object") {
    return obj1 === obj2;
  }
  for (let key in obj1) {
    if (!key in obj2 || !checkPartialStructuralEquality(obj1[key], obj2[key])) return false;
  }
  return true;
}

module.exports = {
  checkStructuralEquality,
  checkPartialStructuralEquality
};