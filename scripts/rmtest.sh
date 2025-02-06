#!/bin/bash
set -e
# Error if no argument is passed
if [ -z "$1" ]; then
  echo "Usage: $0 examples/<test-name>.js"
  exit 1
fi
# Extract the test name from the argument
TEST_NAME=$(basename $1 .js)
# Remove the test file from the test folder packages/babel-plugin-left-side-plugin/test/in/
rm packages/babel-plugin-left-side-plugin/test/in/${TEST_NAME}.js
if [ $? -ne 0 ]; then
  echo "Failed to remove the test file from the test folder packages/babel-plugin-left-side-plugin/test/in/"
  exit 2
fi
# Remove the compiled test file from the test folder packages/babel-plugin-left-side-plugin/test/out/
rm packages/babel-plugin-left-side-plugin/test/out/${TEST_NAME}.js
if [ $? -ne 0 ]; then
  echo "Failed to remove the compiled test file from the test folder packages/babel-plugin-left-side-plugin/test/out/"
  exit 3
fi
# Remove the output file from the test folder packages/babel-plugin-left-side-plugin/test/exec_out/
rm packages/babel-plugin-left-side-plugin/test/exec_out/${TEST_NAME}.js
if [ $? -ne 0 ]; then
  echo "Failed to remove the output file from the test folder packages/babel-plugin-left-side-plugin/test/exec_out/"
  exit 4
fi
