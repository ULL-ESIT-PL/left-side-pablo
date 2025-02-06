const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const inputFolder = path.join(__dirname, "error");


const input = fs.readdirSync(inputFolder, {encoding:"utf-8"});
let configFile = path.join(__dirname, "babel.config.js");

for (let testFile of input) {
  test(testFile, () => {
    const fullTestFile = path.join(inputFolder, testFile);
    let execResult = null;
    try {
      execSync(`npx babel --config-file ${configFile} ${fullTestFile}`, {encoding: "utf-8"}).trim();
    } catch (e) {
      execResult = e.message;
      //console.log(execResult);
    }
    let errorPattern = require(path.join(__dirname, 'errorpattern', testFile));
    const itMatches = errorPattern(execResult);
    //expect(itMatches).toBe(true);
  })
}
