const debug = false;
const CallableInstance = require("callable-instance");
const util = require("util");
const hash = require("object-hash");
const options = {respectType: false, algorithm: "passthrough"};
const {equalityExtensionMap} = require('./equalityMap.js');
const { normalizeArguments, isDeepJSONable } = require("./utils.js");

class StoreMap {
  // Implements the cache based on Map
  constructor() {
    this.store = new Map();
    this.objectStore = [];
  }
  set(key, value, equalityFun) {
    if (typeof key === "function") {
      throw new Error("A function can't be a key in an assignable function");
    }
    if (key !== null && typeof key === "object") {
      if (!isDeepJSONable(key)) {
        throw new Error("The given key contains either a cycle or a function. Key was " + key.toString());
      }
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

class StoreMapWithHash {
  // Implements the cache based on Map
  constructor() {
    this.store = new Map();
  }
  set(key, value, equalityFun) {
    if (typeof key === "function") {
      throw new Error("A function can't be a key in an assignable function");
    }
    if (!isDeepJSONable(key)) {
      throw new Error("The given key contains either a cycle or a function. Key was " + key.toString());
    }
    this.store.set(hash(key, options), value);
  }
  get(key, numParams) {
    return this.store.get(hash(key, options));
  }
  has(key, numParams) { // cache the hash of this keys since a "has" operation is followed by a "get"
    return this.store.has(hash(key, options));
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

let CACHE_TYPE = StoreMapWithHash;

class FunctionObject extends CallableInstance {
  constructor(fun, defaultParams) {
    // CallableInstance accepts the name of the property to use as the callable
    // method.
    super("_call");
    this.defaultParams = defaultParams;
    this.rawFunction = fun;
    this.cache = new CACHE_TYPE();
    this.maxParamNum = defaultParams.length;
    if (this.cache.constructor === StoreMap) {
      this.function = function (...args) {
        let currentCache = this.cache;
        // console.log(currentCache);
        args = normalizeArguments(args, this.defaultParams);
        for (let i = 0; i < this.maxParamNum; ++i) {
          const arg = args[i];
          if (currentCache instanceof this.cache.constructor && currentCache.has(arg)) {
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
    } else if (this.cache.constructor === StoreMapWithHash) {
      this.function = function (...args) {
        // console.log(this.cache)
        const normalizedArgs = normalizeArguments(args, this.defaultParams);
        if (this.cache.has(normalizedArgs, this.maxParamNum)) {
          return this.cache.get(normalizedArgs, this.maxParamNum);
        }
        // console.log("Not here")
        return this.rawFunction(...args);
      }
    } else {
      throw new Error(`TypeError: Unknown cache type ${this.cache.constructor.name}`);
    }
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

function functionObject(fun, defaultParams) {
  if (fun instanceof FunctionObject) return fun;
  return new FunctionObject(fun, defaultParams);
}

module.exports = { functionObject, FunctionObject, CACHE_TYPE, StoreMap, StoreMapWithHash };
