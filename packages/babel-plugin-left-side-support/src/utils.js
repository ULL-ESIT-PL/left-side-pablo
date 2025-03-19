/**
 * ULL. Grado en ingeniería informática
 * Trabajo Fin de Grado (TFG).
 * Curso 2024-2025
 *
 * @author Pablo Santana González <alu0101480541@ull.edu.es>
 * @file utils.js
 * @description Various utility functions for the package.
 */

/**
 * Gets all the values of the given two objects' keys, including non enumerable ones
 * and those inherited through the prototype chain (takes into consideration shadowing properties).
 * @param {object} obj1
 * @param {object} obj2
 * @returns An array with two elements, two arrays representing the values
 *          of each key of obj1 and obj2 (respectively). The index of each
 *          value on these arrays represent the same property on each object
 *          so they should be the same values if they are equal.
 *
 *          Can return null if a key is missing
 */
function getAllKeyValues(obj1, obj2) {
  let valuesObj1 = [];
  let valuesObj2 = [];
  //const obj1Keys = Object.keys(obj1); // Reflect.ownKey gives non-enumerable keys.
  const obj1Keys = Reflect.ownKeys(obj1);
  //const obj2Keys = new Set(Object.keys(obj2));
  const obj2Keys = new Set(Reflect.ownKeys(obj2));
  if (obj1Keys.length !== obj2Keys.size) return false;
  for (let key of obj1Keys) {
    if (!obj2Keys.has(key)) return null;
    try {
      valuesObj1.push(obj1[key]);
      valuesObj2.push(obj2[key]);
    } catch (err) {
      // Do nothing, continue. This should help dealing with properties from prototypes
      // TODO: Check if I can evaluate on the original object.
    }
  }
  // Add prototypes for future comparison
  valuesObj1.push(Object.getPrototypeOf(obj1));
  valuesObj2.push(Object.getPrototypeOf(obj2));
  return [valuesObj1, valuesObj2];
}

/**
 * Checks if the given object is a data structure, not including the Array class or the Object class itself.
 * @param {Object} obj
 * @returns True if it is a data structure, false otherwise.
 */
function isDataStructure(obj) {
  const dataStructuresClasses = [Set, Map];
  for (let currentClass of dataStructuresClasses) {
    if (obj instanceof currentClass) {
      return true;
    }
  }
  return false;
}

module.exports = {
  getAllKeyValues,
  isDataStructure,
}