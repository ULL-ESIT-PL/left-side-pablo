const debug = false;
const CallableInstance = require("callable-instance");
const util = require("util");
const hash = require("object-hash");    // https://www.npmjs.com/package/object-hash
const options = { respectType: false }; // const options = { respectType: false }; // Whether special type attributes (.prototype, .__proto__, .constructor) are hashed. default: true
const { equalityExtensionMap } = require('./equalityMap.js');

class StoreMap {
  // Implements the cache based on Map
  constructor() {
    this.store = new Map();
    this.objectStore = [];
  }
  set(key, value, equalityFun) {
    if (key !== null && typeof key === "object") {
      //const clone = structuredClone(key);
      let clone = null;
      try {
        clone = structuredClone(key);
      } catch (e) {
        throw (`Error attempting to hash infinite data structure "${key.constructor.name}":\n${e.message}`);
      }

      Object.setPrototypeOf(clone, Object.getPrototypeOf(key));
      this.objectStore.push([clone, value, equalityFun]);
      return;
    }
    this.store.set(key, value);
  }
  get(key) {
    if (key !== null && typeof key === "object") {
      for (let [currentKey, currentValue, equalityFun] of this.objectStore) {
        if (equalityFun(currentKey, key)) return currentValue;
      }
      throw Error('This key was not cached. Key was: ' + key.toString());
    }
    return this.store.get(key);
  }
  has(key) {
    if (key !== null && typeof key === "object") {
      for (let [currentKey, _, equalityFun] of this.objectStore) {
        if (equalityFun(currentKey, key)) return true;
      }
      return false;
    }
    return this.store.has(key);
  }
  static equalityExtensionMap = equalityExtensionMap;
}


class StoreMapWithHash {
  // Implements the cache based on Map
  constructor(options) { //Other values for options.semantic can be "error" or "identity"
    this.semantic = options?.semantic || "error";
    this.store = new Map();
    this.objectStore = new Map();
  }
  // Function for deep checking JSON compatibility v0
  isDeepJSONable(obj) {
    const seen = new WeakSet();

    function check(value) {
      // Handle primitives
      if (value === null) return true;

      const type = typeof value;
      if (type === 'string' || type === 'number' || type === 'boolean') return true;
      if (type === 'undefined' || type === 'function' || type === 'symbol') return false;

      // Check for circular references
      if (seen.has(value)) return false;
      seen.add(value);

      // Handle arrays
      if (Array.isArray(value)) {
        return value.every(item => check(item));
      }

      // Handle objects
      if (type === 'object') {
        return Object.values(value).every(v => check(v));
      }

      return false;
    }

    return check(obj);
  }

  set(key, value, equalityFun) {
    if (key !== null && typeof key === "object") {
      if (this.semantic === "error") { // Check if the data structure is infinite using structuredClone
        if (!this.isDeepJSONable(key)) {
          throw (`Error attempting to assign to a function on a non JSON data structure argument`); // make the error more informative
        }
      }

      this.objectStore.set(hash(key, options), value);
      return;
    }
    this.store.set(key, value);
  }
  get(key) {
    if (key !== null && typeof key === "object") {
      return this.objectStore.get(hash(key, options));
    }
    return this.store.get(key);
  }
  has(key) { // cache the hash of this keys since a "has" operation is followed by a "get"
    if (key !== null && typeof key === "object") {
      return this.objectStore.has(hash(key, options));
    }
    return this.store.has(key);
  }
}

class StoreObject {
  // Implements the cache based on Object.create(null)
  constructor() {
    this.store = Object.create(null);
  }
  set(key, value) {
    this.store[key] = value;
  }
  get(key) {
    return this.store[key];
  }
}

//let CACHE_TYPE = StoreMap;
let CACHE_TYPE = StoreMapWithHash;

class FunctionObject extends CallableInstance {
  constructor(a) {
    // CallableInstance accepts the name of the property to use as the callable
    // method.
    super("_call");
    this.rawFunction = a;
    //this.cache = new StoreObject();
    this.cache = new CACHE_TYPE();
    this.maxParamNum = a.length;
    this.function = function (...args) {
      let currentCache = this.cache;
      for (let i = 0; i < this.maxParamNum; ++i) {
        const arg = args[i];
        if (currentCache instanceof CACHE_TYPE && currentCache.has(arg)) {
          if (debug) console.log(`Cached value! ${currentCache.get(arg)}`);
          if (i + 1 === this.maxParamNum) {
            return currentCache.get(arg); // Value in cache, return it.
          }
          currentCache = currentCache.get(arg);
        } else {
          break; // Default to the original rawFunction.
        }
      }
      //console.log(currentFunctionObject)
      return this.rawFunction(...args);
    };
  }

  _call(...args) {
    const result = this.function(...args);
    //console.log(args)
    //console.log(result);
    // Are we sure about this? If the underlying function is supposed to give undefined this would be wrong.
    //return (typeof result == 'undefined') ? null : result;
    return result;
  }

  toFunction() {
    return this.function;
  }

  toString() {
    return this.function.toString();
  }
  setCache(arg, value) {
    //if (arg instanceof Complex) {
    //    arg = arg.toString();
    //}
    this.cache.set(arg, value);
  }
  getCache(arg) {
    //if (arg instanceof Complex) {
    //    arg = arg.toString();
    //}
    return this.cache.get(arg);
  }

  [util.inspect.custom](depths, opts) {
    if (debug) return this;
    return "<FUNCTION_OBJECT>";
  }
}

function functionObject(a) {
  if (a instanceof FunctionObject) return a;
  return new FunctionObject(a);
}

module.exports = { functionObject, FunctionObject, CACHE_TYPE, StoreMap, StoreMapWithHash };
