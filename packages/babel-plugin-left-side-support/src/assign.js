const { checkPartialStructuralEquality, checkStructuralEquality } = require("./equality");
const { functionObject, FunctionObject, CACHE_TYPE, StoreMap, StoreMapWithHash } = require("./function-object");
const { normalizeArguments } = require("./utils");

const ASSIGN_FUNCTION_MAP = new Map();
ASSIGN_FUNCTION_MAP.set(StoreMap, (f, cacheArgs, cacheValue) => {
  //console.log('f', f.toString(), cacheArgs, cacheValue);
  //debugger;
  const maxParamNum = f.maxParamNum;
  let currentCache = f.cache;
  cacheArgs = normalizeArguments(cacheArgs, f.defaultParams);
  for (let i = 0; i < maxParamNum; i++) {
    const cacheArgument = cacheArgs[i];
    const next = i + 1;
    if (next == maxParamNum) {
      // the end
      //console.log(cacheArgs)
      currentCache.set(cacheArgument, cacheValue, checkStructuralEquality);
      return cacheValue;
    }
    // If there are more arguments
    //console.log(f)
    let auxCache;
    if (!currentCache.has(cacheArgument)) {
      auxCache = new StoreMap();
      currentCache.set(cacheArgument, auxCache, checkStructuralEquality);
    } else {
      auxCache = currentCache.get(cacheArgument);
    }
    //console.log(f(cacheArgument))
    //console.error(`assign f.cache["${cacheArgument}"] = ${auxF}`);
    currentCache = auxCache;
  }
});

ASSIGN_FUNCTION_MAP.set(StoreMapWithHash, (f, cacheArgs, cacheValue) => {
  // Adjusting arguments so it is always the same
  const normalizedArgs = normalizeArguments(cacheArgs, f.defaultParams);
  f.setCache(normalizedArgs, cacheValue);
});

/**
 *
 * @param {FunctionObject} f
 * @param {Array[any]} cacheArgs
 * @param {any} cacheValue
 * @returns
 */
function assign(f, cacheArgs, cacheValue) {
  if (!(f instanceof FunctionObject)) {
    throw new Error('TypeError: Cannot assign values to a normal function. It must be a FunctionObject');
  }
  const ASSIGN_FUNCTION = ASSIGN_FUNCTION_MAP.get(f.cache.constructor);
  if (!ASSIGN_FUNCTION) {
    throw new Error(`TypeError: Unexpected cache type ${f.cache.constructor.name}`);
  }
  ASSIGN_FUNCTION(f, cacheArgs, cacheValue);
}

module.exports = { assign };
