const { functionObject, FunctionObject, CACHE_TYPE } = require("./function-object");

function assign(f, cacheArgs, cacheValue, partialMatchingIndexes) {
  //console.log('f', f.toString(), cacheArgs, cacheValue);
  //debugger;
  if (!f instanceof FunctionObject) {
    throw new Error('TypeError: Cannot assign values to a normal function. It must be a FunctionObject');
  }
  partialMatchingIndexes = new Set(partialMatchingIndexes);
  const maxParamNum = f.maxParamNum;
  let currentCache = f.cache;
  for (let i = 0; i < maxParamNum; i++) {
    const cacheArgument = cacheArgs[i];
    /* It is a possibility to assign both null and undefined argument values.
    if (cacheArgument == null) {
      const error = new Error(
        "Invalid null argument on left side of assignment",
      );
      throw error;
    }*/
    const next = i + 1;
    if (next == maxParamNum) {
      // the end
      //console.log(cacheArgs)
      currentCache.set(cacheArgument, cacheValue);
      return cacheValue;
    }
    // If there are more arguments
    //console.log(f)
    let auxCache;
    if (!currentCache.has(cacheArgument)) {
      if (partialMatchingIndexes.has(i)) {
        auxCache = new CACHE_TYPE(true);
      } else {
        auxCache = new CACHE_TYPE();
      }
      currentCache.set(cacheArgument, auxCache);
    } else {
      auxCache = currentCache.get(cacheArgument);
    }
    //functionObject(f.rawFunction ? f.rawFunction : f);
    //console.log(f(cacheArgument))
    //f.setCache(cacheArgument, auxF);
    //console.error(`assign f.cache["${cacheArgument}"] = ${auxF}`);
    currentCache = auxCache;
  }
}

module.exports = { assign };
