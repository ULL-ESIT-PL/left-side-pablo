function @@ foo(bar) {
  return function @@ tutu(baz) {
    return bar.concat(baz);
  }
}

// Semantic decision: references are not allowed as keys in a function assignment
// Error: Invalid left side callexpression in assignment. A "object" can not be used as a key in an assignment.
try { 
  foo([1, 2])(3) = 9;
} catch (e) { console.log(e.message) }; 

