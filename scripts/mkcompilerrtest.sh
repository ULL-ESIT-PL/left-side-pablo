#!/bin/bash
set -e
# Error if no argument is passed
if [ -z "$1" ]; then
  echo "Usage: $0 examples/<err-test-name>.js"
  exit 1
fi
# Extract the test name from the argument
TEST_NAME=$(basename $1 .js)
# Copy the test file to the test folder packages/babel-plugin-left-side-plugin/test/in/
cp examples/${TEST_NAME}.js packages/babel-plugin-left-side-plugin/test/error/
if [ $? -ne 0 ]; then
  exit 2
fi
# Compile the test file with babel
(cd examples && npx babel $TEST_NAME.js --out-file ${TEST_NAME}.cjs)
if [ $? -eq 0 ]; then
  echo "Expected the compilation to fail"
  exit 3
fi
echo "Remember to edit packages/babel-plugin-left-side-plugin/test/errorpattern/${TEST_NAME}.js with a pattern to match the error message"
