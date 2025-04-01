const debug = false;
const CallableInstance = require("callable-instance");
const util = require("util");
const {checkStructuralEquality} = require("./equality.js");
const {equalityExtensionMap} = require('./equalityMap.js');

class StoreMap {
  // Implements the cache based on Map
  constructor() {
    this.store = new Map();
    this.objectStore = [];
  }
  set(key, value, equalityFun) {
    if (key !== null && typeof key === "object") {
      const clone = structuredClone(key);
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

const CACHE_TYPE = StoreMap;

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

  [util.inspect.custom] (depths, opts) {
    if (debug) return this;
    return "<FUNCTION_OBJECT>";
  }
}

function functionObject(a) {
  if (a instanceof FunctionObject) return a;
  return new FunctionObject(a);
}

module.exports = { functionObject, FunctionObject, CACHE_TYPE };
