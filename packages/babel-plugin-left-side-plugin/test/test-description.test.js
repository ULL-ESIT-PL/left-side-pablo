const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const inputFolder = path.join(__dirname, "in");
const execOutFolder = path.join(__dirname, "exec_out");
const input = fs.readdirSync(inputFolder, {encoding:"utf-8"});
const execOut = new Set(fs.readdirSync(execOutFolder, {encoding:"utf-8"}));
const outFolder = path.join(__dirname, "out");
let configFile = path.join(__dirname, "babel.config.js");
const ansiRegex = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/ug; // Remove ANSI escape codes

for (let testFile of input) {
  test(testFile, () => {
    const fullTestFile = path.join(inputFolder, testFile);
    expect(execOut.has(testFile)).toBeTruthy();
    const output = execSync(`npx babel --config-file ${configFile} ${fullTestFile}`, {encoding: "utf-8"}).trim();
    const outputPath = path.join(outFolder, testFile);
    fs.writeFileSync(outputPath, output, {encoding: "utf-8"});
    let execResult = execSync(`node --no-warnings ${outputPath}`, {encoding: "utf-8"}).replace(ansiRegex, "").trim();
    const execOutTestFile = path.join(execOutFolder, testFile).toString();
    expect(execResult).toBe(fs.readFileSync(execOutTestFile, {encoding: "utf-8"}).trim());
  })
}
