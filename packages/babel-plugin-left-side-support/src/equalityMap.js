/**
 * ULL. Grado en ingeniería informática
 * Trabajo Fin de Grado (TFG).
 * Curso 2024-2025
 *
 * @author Pablo Santana González <alu0101480541@ull.edu.es>
 * @file equalityMap.js
 * @description File containing a Map with a constructor function as a key
 *              and a function returning values for later comparison as value.
 */

const equalityExtensionMap = new Map();

/**
 *  Returns the value of the properties considered to "extend" the equality.
 * @param {Map | Set} first
 * @param {Map | Set} second
 */
const mapSetCallback = (first, second) => {
  const firstValues = Array.from(first.entries()).sort((a, b) => a[0] - b[0]); // Sorting to assert that the entries are in the same order in both objects.
  const secondValues = Array.from(second.entries()).sort((a, b) => a[0] - b[0]);
  return [firstValues, secondValues];
}

equalityExtensionMap.set(Set, mapSetCallback);
equalityExtensionMap.set(Map, mapSetCallback);

equalityExtensionMap.set(RegExp, (first, second) => {
  const firstValues = [first.source, first.flags];
  const secondValues = [second.source, second.flags];
  return [firstValues, secondValues];
});

/**
 *  Returns the value of the properties considered to "extend" the equality.
 * @param {Error} first
 * @param {Error} second
 */
const errorTypeCallback = (first, second) => {
  const firstValues = [first.name, first.message];
  const secondValues = [second.name, second.message];
  return [firstValues, secondValues];
}

const errorTypes = [Error, AggregateError, EvalError, RangeError, ReferenceError,
                    SyntaxError, TypeError, URIError];
for (let errorType of errorTypes) {
  equalityExtensionMap.set(errorType, errorTypeCallback);
}

equalityExtensionMap.set(Date, (first, second) => {
  const firstValues = [first.getUTCFullYear(), first.getUTCMonth(), first.getUTCDate()];
  const secondValues = [second.getUTCFullYear(), second.getUTCMonth(), second.getUTCDate()];
  return [firstValues, secondValues];
});

/*
equalityExtensionMap.set(BigInt, (first, second) => {
  const firstValues = [first.toString()];
  const secondValues = [second.toString()];
  return [firstValues, secondValues];
});*/

module.exports = {
  equalityExtensionMap
}