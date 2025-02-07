const { functionObject,  FunctionObject} = require("./function-object");

function assign(f, cacheArgs, cacheValue) {
  //if (f.debug) console.log('src f', f.toString(), cacheArgs, cacheValue);
  //debugger;
  
  if (!(f instanceof FunctionObject)) {
     throw `TypeError: Assigning to an ordinary Function`;
     // f = functionObject(f); // TODO: Why is that if the throw is removed, this line does not work? Because is a "value assignment" and the true "f" is not changed? It must be done at compile time?
  }
  const cacheArgument = cacheArgs[0];
  f.setCache(cacheArgument, cacheValue);
  return cacheValue; 
}

function mAssign(f, cacheArgs, cacheValue) {
  // debugger;
  for (let i = 0; i < cacheArgs.length; i++) {
    const cacheArgument = cacheArgs[i];
    const next = i + 1;
    if (next == cacheArgs.length) { // the end
      if (!(f instanceof FunctionObject)) {
        throw `TypeError: Assigning to an ordinary Function. Convert to FunctionObject instead.`;
      }
      f.setCache(cacheArgument, cacheValue);
      return cacheValue;
    }
    // If there are more arguments
    let auxF = f.getCache(cacheArgument);
    if (!f?.cache?.has(cacheArgument)) { 
      f.setCache(cacheArgument, auxF = f(cacheArgument));
    } else if (!(auxF instanceof FunctionObject)) { 
      throw `TypeError: Assigning to an ordinary Function. Convert to FunctionObject instead.`;
    }
    f = auxF;
  }
}

module.exports = { assign, mAssign };
