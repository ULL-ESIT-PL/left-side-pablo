// TODO: Implement strategy pattern and make this module extensible and pluggable so that the `isDeepJSONable` and `hash` functions can be replaced by other implementations.

let objectHash = require("object-hash");    // https://www.npmjs.com/package/object-hash

function hash(obj, options) {
  try {
    return objectHash(obj, options);
  } catch (e) {
    throw (`Error attempting to hash unsupported data structure "${obj?.constructor?.name || typeof obj}":\n${e.message}`);
  }
}

function isDeepJSONable(obj) {
  const seen = new WeakSet();

  function check(value) {
    // Handle primitives
    if (value === null) return true;


    const type = typeof value;
    switch (type) {
      case 'string':
      case 'number':
      case 'boolean':
      case 'bigint': // Extended JSONable
      case 'symbol':
        return true;
      case 'undefined':
      case 'function':
        return false;
    }

    // Check for circular references
    if (seen.has(value)) return false;
    seen.add(value);

    // Handle arrays
    if (Array.isArray(value)) {
      return value.every(item => check(item));
    }

    // Handle objects
    if (type === 'object') {
      //console.log(Object.values(value));
      switch (value?.constructor?. name) {
         case 'Date', 'RegExp', 'Map', 'Set', 'WeakMap', 'WeakSet':
          //console.log(value?.constructor?.name);
          return true; // Exteded JSONable
          default: return Object.values(value).every(v => check(v));
      }
    }

    return false;
  }

  return check(obj);
}

module.exports = { isDeepJSONable, hash }