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
 * Gets all the values of the given two objects' keys.
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
  //const obj1Keys = Reflect.ownKeys(obj1); // Reflect.ownKey gives non-enumerable keys.
  const obj1Keys = Object.keys(obj1);
  //const obj2Keys = new Set(Reflect.ownKeys(obj2));
  const obj2Keys = new Set(Object.keys(obj2));
  if (obj1Keys.length !== obj2Keys.size) return null;
  for (let key of obj1Keys) {
    if (!obj2Keys.has(key)) return null;
    valuesObj1.push(obj1[key]);
    valuesObj2.push(obj2[key]);
  }
  return [valuesObj1, valuesObj2];
}

/**
 * Fills the given array with the given values
 * @param {array} arr The array to be filled
 * @param {number} defaultValues The default values to fill the array with
 * @returns {array} The array
 */
function normalizeArguments(arr, defaultValues) {
  if (arr.length > defaultValues) {
    return arr.slice(0, defaultValues.length);
  }
  return arr.concat(defaultValues.slice(arr.length));
}

module.exports = {
  getAllKeyValues,
  normalizeArguments
}