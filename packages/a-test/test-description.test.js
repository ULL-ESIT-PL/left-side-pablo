const { execSync } = require("child_process");
const fs = require("fs");
const { exit } = require("process");
const inputBase = './in';
const input = fs.readdirSync(inputBase, {encoding: "utf-8"});
const inputError = fs.readdirSync("./in_error", {encoding: "utf-8"});
const execOutBase = './exec_out';
const execOut = new Set(fs.readdirSync(execOutBase, {encoding:"utf-8"}));

const testExample = (testFile, expectCorrectOutput = true) => {
  //expect(execOut.has(testFile)).toBeTruthy();
  const output = execSync(`npx babel ./in/${testFile}`, {encoding: "utf-8"}).trim();
  const outputPath = `./out/${testFile}`;
  fs.writeFileSync(outputPath, output, {encoding: "utf-8"});
  let execResult = execSync(`node --no-warnings ${outputPath}`, {encoding: "utf-8"}).trim();
  if (expectCorrectOutput)
    expect(execResult).toBe(fs.readFileSync(`./exec_out/${testFile}`, {encoding: "utf-8"}).trim());
}

for (let subDirectory of input) {
  describe(subDirectory + " testing", () => {
    const directoryPath = inputBase + '/' + subDirectory;
    const tests = fs.readdirSync(directoryPath, {encoding: "utf-8"});
    //console.log(subDirectory)
    //console.log(directoryPath)
    for (let testFile of tests) {
      const testPath = subDirectory + '/' + testFile;
      test(testPath, () => testExample(testPath));
    }
  })
}
describe("Error testing", () => {
  for (let testFile of inputError) {
    test.failing(testFile, () => testExample(testFile, false));
  }
})