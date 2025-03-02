const { execSync } = require("child_process");
const fs = require("fs");
const input = fs.readdirSync("./in", {encoding: "utf-8"});
const inputError = fs.readdirSync("./in_error", {encoding: "utf-8"});
const execOut = new Set(fs.readdirSync("./exec_out", {encoding:"utf-8"}));

const testExample = (testFile) => {
  //expect(execOut.has(testFile)).toBeTruthy();
  const output = execSync(`npx babel ./in/${testFile}`, {encoding: "utf-8"}).trim();
  const outputPath = `./out/${testFile}`;
  fs.writeFileSync(outputPath, output, {encoding: "utf-8"});
  let execResult = execSync(`node --no-warnings ${outputPath}`, {encoding: "utf-8"}).trim();
  expect(execResult).toBe(fs.readFileSync(`./exec_out/${testFile}`, {encoding: "utf-8"}).trim());
}
describe("Core testing", () => {
  for (let testFile of input) {
    test(testFile, () => testExample(testFile));
  }
})
describe("Error testing", () => {
  for (let testFile of inputError) {
    test.failing(testFile, () => testExample(testFile));
  }
})