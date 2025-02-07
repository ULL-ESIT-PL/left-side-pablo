# Tests for the left-side assignment packages
- By Pablo Santana González [@PSantanaGlez13](https://github.com/PSantanaGlez13)
## Structure
The structure of this directory goes as follows:
- `in` contains the file with the source code with the left-side assignment syntax.
- `out` contains the code after being transformed with Babel and the left-side plugin.
- `exec_out` contains the expected output when executing the transformed code with node.
- `test-description.test.js` describes the logic of the tests.

- `error` contains the file with the source code with the left-side assignment syntax that should throw an error.
- `errorpattern` contains a JS file exporting a function taht receives the error and returns a boolean indicating if the error is the expected one. See [errorpattern/example-errors.js](errorpattern/example-errors.js)

## Test logic

For correct programs, the files in `in` are processed and their outputs are written in `out`. This output is then run with node. If the result matches the result given in `exec_out`.

For incorrect programs, the files in `error` are processed and the error is checked against the expected error. The expected error is defined in the `errorpattern` directory via a handler function.

## Adding more tests

For correct programs,  you can add the input file to `in` and the expected result when executing in `exec_out`. Make sure both files have the same name.

For incorrect programs, you can add the input file to `error` and the expected error handler to `errorpattern`. Make sure both files have the same name.
