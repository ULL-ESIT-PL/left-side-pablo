function @@ foo(x) {
  return x*2;
}

foo([2]) = 5; // Invalid left side callexpression in assignment. An "object" can not be used as a key in an assignment
