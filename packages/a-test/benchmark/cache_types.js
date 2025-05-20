const {functionObject, assign, StoreMap, StoreMapWithHash} = require("@ull-esit-pl/babel-plugin-left-side-support")
let {CACHE_TYPE} = require("@ull-esit-pl/babel-plugin-left-side-support");
// TODO: Do a battery of sizes, design a test with more complex objects like objects with various levels of depth, maps and sets.
// There is a pattern in these tests, see the comments in assignTest. Maybe doing a structure that allows for quick changes.
const TEST_SIZE = 50_000;

const assignTest = (functionObj) => {
  console.log(`Time for ${TEST_SIZE} assignations:`);
  let currentArr = []; // Previous to the test/Setup
  console.time("test");
  try {
    for (let i = 0; i < TEST_SIZE; ++i) {
      currentArr.push(i); // During test
      assign(functionObj, currentArr, 1); // Assignment
    }
  } catch (err) {
    console.log("Failed with ", err);
  }
  console.timeEnd("test");
}

const searchTest = (functionObj) => {
  console.log(`Time for ${TEST_SIZE} searches (calls):`);
  let currentArr = [];
  console.time("test");
  try {
    for (let i = 0; i < TEST_SIZE; ++i) {
      currentArr.push(i);
      functionObj(currentArr);
    }
  } catch (err) {
    console.log("Failed with ", err)
  }
  console.timeEnd("test");
}

const mainTest = (cacheType) => {
  CACHE_TYPE = cacheType;
  console.log(`Tests for ${cacheType.name}:`);
  const functionObj = functionObject(function (param) {return 0;}, []);
  assignTest(functionObj);
  console.log()
  searchTest(functionObj);
}

mainTest(StoreMapWithHash);
console.log()
mainTest(StoreMap);