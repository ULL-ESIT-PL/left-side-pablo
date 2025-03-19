// File containing equality functions for object comparison.
const {getAllKeyValues, isDataStructure} = require('./utils.js');

// Full match between two objects
function checkStructuralEquality(obj1, obj2) {
  let toCheckForEqualityObj1 = [obj1],
      toCheckForEqualityObj2 = [obj2];
  let checkedObjects = new Map();
  while (toCheckForEqualityObj1.length != 0) {
    obj1 = toCheckForEqualityObj1.pop();
    obj2 = toCheckForEqualityObj2.pop();
    if (checkedObjects.has(obj1)) {
      let previousMatches = checkedObjects.get(obj1);
      if (previousMatches.includes(obj2)) {
        continue;
      } else {
        previousMatches.push(obj2);
      }
    } else {
      checkedObjects.set(obj1, [obj2])
    }
    if (obj1 === null || obj2 === null /*|| obj1 == undefined || obj2 == undefined*/) {
      if (obj1 === obj2) { // Both null or undefined
        continue;
      } else {
        return false;
      }
    }
    if (typeof obj1 !== typeof obj2 || Object.keys(obj1).length !== Object.keys(obj2).length) { // Check for same type and same number of properties
      return false;
    }
    if (typeof obj1 !== "object" || obj1 instanceof Function) {
      if (obj1 === obj2) { // Primitive with same value or function with same reference
        continue;
      } else {
        return false;
      }
    }
    const allKeysValues = getAllKeyValues(obj1, obj2);
    if (!allKeysValues) return false;
    const [valuesObj1, valuesObj2] = allKeysValues;
    toCheckForEqualityObj1.push(...valuesObj1);
    toCheckForEqualityObj2.push(...valuesObj2);
    if (isDataStructure(obj1)) { // Avoid Array since properties of an Array are already checked and creating another Array will eventually cause a stack error.
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