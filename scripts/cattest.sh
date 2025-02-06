#!/bin/bash
set -e
# Error if no argument is passed
if [ -z "$1" ]; then
  echo "Usage: $0 examples/<test-name>.js"
  exit 1
fi
# Extract the test name from the argument
TEST_NAME=$(basename $1 .js)
cat packages/babel-plugin-left-side-plugin/test/in/$TEST_NAME.js
