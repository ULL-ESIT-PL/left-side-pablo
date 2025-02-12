// File containing equality functions for object comparison.

// Full match between two objects
function checkStructuralEquality(obj1, obj2) {
  if (typeof obj1 !== typeof obj2) {
    return false;
  }
  if (typeof obj1 !== "object") {
    return obj1 === obj2;
  }
  for (let key in obj1) {
    if (!key in obj2 || !checkStructuralEquality(obj1[key], obj2[key])) return false;
  }
  return true;
}

module.exports = {
  checkStructuralEquality
};