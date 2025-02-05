# Examples

This folder is used to test ideas about the plugin. 
Examples are first tested here before being included in the test suite.


## Compiling 

Given the source:

`➜  examples git:(main) cat hello.js`
```js 
function @@ foo(bar) {
  return bar * 2;
}
foo(10) = 5;

console.log(foo(10)); //  5
console.log(foo(5));  // 10
```
We can compile it with:

```js 
➜  examples git:(main) ✗ npx babel  hello.js       
const {
  assign,
  functionObject
} = require("@ull-esit-pl/babel-plugin-left-side-support");
const foo = functionObject(function (bar) {
  return bar * 2;
});
assign(foo, [10], 5);
console.log(foo(10)); //  5
console.log(foo(5)); // 10
```

and run the compiled code with `node`:

```
➜  examples git:(main) ✗ npx babel  hello.js | node                       
5
10
```

## Installation

Notice, that due to the use of the workspaces in this project, in the root `node_modules` folder, 
we find symbolic links to the packages to the workspace packages:

```bash
➜  parser-left-side-crguezl git:(main) ✗ ls -l node_modules/@ull-esit-pl-2425 
total 0
lrwxr-xr-x@ 1 casianorodriguezleon  staff  27 25 dic 16:48 babel-parser -> ../../packages/babel-parser
lrwxr-xr-x@ 1 casianorodriguezleon  staff  37 25 dic 15:33 babel-plugin-left-side -> ../../packages/babel-plugin-left-side
lrwxr-xr-x@ 1 casianorodriguezleon  staff  45 25 dic 15:33 babel-plugin-left-side-support -> ../../packages/babel-plugin-left-side-support
```

This is why the  `require("@ull-esit-pl/babel-plugin-left-side-support")` in the generated example `hello.cjs` works:

```js 
const {
  assign,
  functionObject
} = require("@ull-esit-pl/babel-plugin-left-side-support");
...
```

Notice that the `package.json` in the examples folder has no dependencies:

`➜  parser-left-side-crguezl git:(main) ✗ cat examples/package.json`
```json 
{
  "name": "examples",
  "version": "1.0.0",
  "description": "",
  "main": "hello.js",
  "scripts": {
    "test": "npm i && babel hello.js --out-file hello.cjs && node hello.cjs",
    "cppabloparser": " cp ../../pablo-santana-gonzalez/babel-tanhauhau-pablo/packages/babel-parser/lib/index.js ../packages/babel-parser/lib",
    "testparser": "../packages/babel-parser/bin/babel-parser.js hello.js",
    "save": " cd .. && npm run save"
  },
  "keywords": [],
  "author": "Casiano Rodriguez Leon <crguezl@ull.edu.es> (https://crguezl.github.io/)",
  "license": "ISC"
}
```

## Babel Configuration

Also see that if you use the JSON format for the Babel configuration, you have to use the relative path:

`➜  examples git:(main) ✗ git -P show HEAD:examples/babel.config.json`
```json
{
  "plugins": [
    "../packages/babel-plugin-left-side/"
  ]
}
```

But if you use the JavaScript format, you can use the workspace trick:

`➜  examples git:(main) ✗ cat babel.config.js`
```js 
const leftSidePlugin = require("@ull-esit-pl-2425/babel-plugin-left-side");
module.exports = {
  "plugins": [ leftSidePlugin, ]
};
```

## Assignable Methods

This example shows a simple example of an assignable method:

`➜  examples git:(main) ✗ cat example-method.js`
```js
let a = {foo: function @@ something(a) {return a}};
a.foo("bar") = "fighter";
console.log(a.foo("x")); // x
console.log(a.foo("bar")); // fighter
```

```bash 
➜  examples git:(main) ✗ npx babel example-method.js | node
x
fighter
```

## Examples containing errors

### Methodology for the tests

When the expected behavior of the babel compiler for the example (like `empty-assignment.js`) is to issue an error message, copy a truncated 
version of the error message in `packages/babel-parser/test/left-side/exec_out/syntaxerror-empty-assignment.js` (notice the prefix `syntaxerror-`). Is not being really tested at this time. The check is just that the word `SyntaxError` appears in the output.

If the expected behavior is to compile but have a runtime error, copy the output in `packages/babel-parser/test/left-side/exec_out/runtime-error-empty-assignment.js` (notice the prefix `runtime-error-`). The check is just that the word `RuntimeError` appears in the output.

### Empty assignments

See issues [#32](https://github.com/ULL-ESIT-PL/babel-tanhauhau/issues/32) and [#31](https://github.com/ULL-ESIT-PL/babel-tanhauhau/issues/31)

## TODO

- See the [not-working](not-working) folder
- Nested assignation is not working.

  ``` 
  examples git:(main) npx babel example-nested-assignation.js  
  ```
- Multiparameter not working:

  ``` 
  npx babel example-multiparameter.js | node -
  ```

## Parser

As it was explained in the section [Installation](#Installation), the parser is installed in the workspace, so I can use `npx parser` to run it:

```bash
➜  examples git:(main) ✗ npx parser hello.js | jq '.type'
"File"
```

or we can use the parser directly:

```js
➜  examples git:(main) ✗ ../packages/babel-parser/bin/babel-parser.js hello.js 
{
  "type": "File",
  "start": 0,
  "end": 112,
  "loc": {
    "start": {
      "line": 1,
      "column": 0
    },
    "end": {
      "line": 7,
      "column": 27
    }
  },
  "errors": [],
  "program": {
    "type": "Program",
    "start": 0,
    "end": 112,
    "loc": {
      "start": {
        "line": 1,
        "column": 0
      },
      "end": {
        "line": 7,
        "column": 27
      }
    },
    "sourceType": "script",
    "interpreter": null,
    "body": [
      {
        "type": "FunctionDeclaration",
        "start": 0,
        "end": 42,
        "loc": {
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 3,
            "column": 1
          }
        },
        "id": {
          "type": "Identifier",
          "start": 12,
          "end": 15,
          "loc": {
            "start": {
              "line": 1,
              "column": 12
            },
            "end": {
              "line": 1,
              "column": 15
            },
            "identifierName": "foo"
          },
          "name": "foo"
        },
        "generator": false,
        "async": false,
        "assignable": true,
        "params": [
          {
            "type": "Identifier",
            "start": 16,
            "end": 19,
            "loc": {
              "start": {
                "line": 1,
                "column": 16
              },
              "end": {
                "line": 1,
                "column": 19
              },
              "identifierName": "bar"
            },
            "name": "bar"
          }
        ],
        "body": {
          "type": "BlockStatement",
          "start": 21,
          "end": 42,
          "loc": {
            "start": {
              "line": 1,
              "column": 21
            },
            "end": {
              "line": 3,
              "column": 1
            }
          },
          "body": [
            {
              "type": "ReturnStatement",
              "start": 25,
              "end": 40,
              "loc": {
                "start": {
                  "line": 2,
                  "column": 2
                },
                "end": {
                  "line": 2,
                  "column": 17
                }
              },
              "argument": {
                "type": "BinaryExpression",
                "start": 32,
                "end": 39,
                "loc": {
                  "start": {
                    "line": 2,
                    "column": 9
                  },
                  "end": {
                    "line": 2,
                    "column": 16
                  }
                },
                "left": {
                  "type": "Identifier",
                  "start": 32,
                  "end": 35,
                  "loc": {
                    "start": {
                      "line": 2,
                      "column": 9
                    },
                    "end": {
                      "line": 2,
                      "column": 12
                    },
                    "identifierName": "bar"
                  },
                  "name": "bar"
                },
                "operator": "*",
                "right": {
                  "type": "NumericLiteral",
                  "start": 38,
                  "end": 39,
                  "loc": {
                    "start": {
                      "line": 2,
                      "column": 15
                    },
                    "end": {
                      "line": 2,
                      "column": 16
                    }
                  },
                  "extra": {
                    "rawValue": 2,
                    "raw": "2"
                  },
                  "value": 2
                }
              }
            }
          ],
          "directives": []
        }
      },
      {
        "type": "ExpressionStatement",
        "start": 43,
        "end": 55,
        "loc": {
          "start": {
            "line": 4,
            "column": 0
          },
          "end": {
            "line": 4,
            "column": 12
          }
        },
        "expression": {
          "type": "AssignmentExpression",
          "start": 43,
          "end": 54,
          "loc": {
            "start": {
              "line": 4,
              "column": 0
            },
            "end": {
              "line": 4,
              "column": 11
            }
          },
          "operator": "=",
          "left": {
            "type": "CallExpression",
            "start": 43,
            "end": 50,
            "loc": {
              "start": {
                "line": 4,
                "column": 0
              },
              "end": {
                "line": 4,
                "column": 7
              }
            },
            "callee": {
              "type": "Identifier",
              "start": 43,
              "end": 46,
              "loc": {
                "start": {
                  "line": 4,
                  "column": 0
                },
                "end": {
                  "line": 4,
                  "column": 3
                },
                "identifierName": "foo"
              },
              "name": "foo"
            },
            "arguments": [
              {
                "type": "NumericLiteral",
                "start": 47,
                "end": 49,
                "loc": {
                  "start": {
                    "line": 4,
                    "column": 4
                  },
                  "end": {
                    "line": 4,
                    "column": 6
                  }
                },
                "extra": {
                  "rawValue": 10,
                  "raw": "10"
                },
                "value": 10
              }
            ]
          },
          "right": {
            "type": "NumericLiteral",
            "start": 53,
            "end": 54,
            "loc": {
              "start": {
                "line": 4,
                "column": 10
              },
              "end": {
                "line": 4,
                "column": 11
              }
            },
            "extra": {
              "rawValue": 5,
              "raw": "5"
            },
            "value": 5
          }
        }
      },
      {
        "type": "ExpressionStatement",
        "start": 57,
        "end": 78,
        "loc": {
          "start": {
            "line": 6,
            "column": 0
          },
          "end": {
            "line": 6,
            "column": 21
          }
        },
        "expression": {
          "type": "CallExpression",
          "start": 57,
          "end": 77,
          "loc": {
            "start": {
              "line": 6,
              "column": 0
            },
            "end": {
              "line": 6,
              "column": 20
            }
          },
          "callee": {
            "type": "MemberExpression",
            "start": 57,
            "end": 68,
            "loc": {
              "start": {
                "line": 6,
                "column": 0
              },
              "end": {
                "line": 6,
                "column": 11
              }
            },
            "object": {
              "type": "Identifier",
              "start": 57,
              "end": 64,
              "loc": {
                "start": {
                  "line": 6,
                  "column": 0
                },
                "end": {
                  "line": 6,
                  "column": 7
                },
                "identifierName": "console"
              },
              "name": "console"
            },
            "property": {
              "type": "Identifier",
              "start": 65,
              "end": 68,
              "loc": {
                "start": {
                  "line": 6,
                  "column": 8
                },
                "end": {
                  "line": 6,
                  "column": 11
                },
                "identifierName": "log"
              },
              "name": "log"
            },
            "computed": false
          },
          "arguments": [
            {
              "type": "CallExpression",
              "start": 69,
              "end": 76,
              "loc": {
                "start": {
                  "line": 6,
                  "column": 12
                },
                "end": {
                  "line": 6,
                  "column": 19
                }
              },
              "callee": {
                "type": "Identifier",
                "start": 69,
                "end": 72,
                "loc": {
                  "start": {
                    "line": 6,
                    "column": 12
                  },
                  "end": {
                    "line": 6,
                    "column": 15
                  },
                  "identifierName": "foo"
                },
                "name": "foo"
              },
              "arguments": [
                {
                  "type": "NumericLiteral",
                  "start": 73,
                  "end": 75,
                  "loc": {
                    "start": {
                      "line": 6,
                      "column": 16
                    },
                    "end": {
                      "line": 6,
                      "column": 18
                    }
                  },
                  "extra": {
                    "rawValue": 10,
                    "raw": "10"
                  },
                  "value": 10
                }
              ]
            }
          ]
        },
        "trailingComments": [
          {
            "type": "CommentLine",
            "value": "  5",
            "start": 79,
            "end": 84,
            "loc": {
              "start": {
                "line": 6,
                "column": 22
              },
              "end": {
                "line": 6,
                "column": 27
              }
            }
          }
        ]
      },
      {
        "type": "ExpressionStatement",
        "start": 85,
        "end": 105,
        "loc": {
          "start": {
            "line": 7,
            "column": 0
          },
          "end": {
            "line": 7,
            "column": 20
          }
        },
        "expression": {
          "type": "CallExpression",
          "start": 85,
          "end": 104,
          "loc": {
            "start": {
              "line": 7,
              "column": 0
            },
            "end": {
              "line": 7,
              "column": 19
            }
          },
          "callee": {
            "type": "MemberExpression",
            "start": 85,
            "end": 96,
            "loc": {
              "start": {
                "line": 7,
                "column": 0
              },
              "end": {
                "line": 7,
                "column": 11
              }
            },
            "object": {
              "type": "Identifier",
              "start": 85,
              "end": 92,
              "loc": {
                "start": {
                  "line": 7,
                  "column": 0
                },
                "end": {
                  "line": 7,
                  "column": 7
                },
                "identifierName": "console"
              },
              "name": "console"
            },
            "property": {
              "type": "Identifier",
              "start": 93,
              "end": 96,
              "loc": {
                "start": {
                  "line": 7,
                  "column": 8
                },
                "end": {
                  "line": 7,
                  "column": 11
                },
                "identifierName": "log"
              },
              "name": "log"
            },
            "computed": false
          },
          "arguments": [
            {
              "type": "CallExpression",
              "start": 97,
              "end": 103,
              "loc": {
                "start": {
                  "line": 7,
                  "column": 12
                },
                "end": {
                  "line": 7,
                  "column": 18
                }
              },
              "callee": {
                "type": "Identifier",
                "start": 97,
                "end": 100,
                "loc": {
                  "start": {
                    "line": 7,
                    "column": 12
                  },
                  "end": {
                    "line": 7,
                    "column": 15
                  },
                  "identifierName": "foo"
                },
                "name": "foo"
              },
              "arguments": [
                {
                  "type": "NumericLiteral",
                  "start": 101,
                  "end": 102,
                  "loc": {
                    "start": {
                      "line": 7,
                      "column": 16
                    },
                    "end": {
                      "line": 7,
                      "column": 17
                    }
                  },
                  "extra": {
                    "rawValue": 5,
                    "raw": "5"
                  },
                  "value": 5
                }
              ]
            }
          ]
        },
        "leadingComments": [
          {
            "type": "CommentLine",
            "value": "  5",
            "start": 79,
            "end": 84,
            "loc": {
              "start": {
                "line": 6,
                "column": 22
              },
              "end": {
                "line": 6,
                "column": 27
              }
            }
          }
        ],
        "trailingComments": [
          {
            "type": "CommentLine",
            "value": " 10",
            "start": 107,
            "end": 112,
            "loc": {
              "start": {
                "line": 7,
                "column": 22
              },
              "end": {
                "line": 7,
                "column": 27
              }
            }
          }
        ]
      }
    ],
    "directives": []
  },
  "comments": [
    {
      "type": "CommentLine",
      "value": "  5",
      "start": 79,
      "end": 84,
      "loc": {
        "start": {
          "line": 6,
          "column": 22
        },
        "end": {
          "line": 6,
          "column": 27
        }
      }
    },
    {
      "type": "CommentLine",
      "value": " 10",
      "start": 107,
      "end": 112,
      "loc": {
        "start": {
          "line": 7,
          "column": 22
        },
        "end": {
          "line": 7,
          "column": 27
        }
      }
    }
  ]
}
```


