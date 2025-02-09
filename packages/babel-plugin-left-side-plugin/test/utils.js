const { exec } = require("child_process");
const path = require("path");
const inputFolder = path.join(__dirname, "compileerror");
const outFolder = path.join(__dirname, "out");
const runTimeInputFolder = path.join(__dirname, "runtimeerror");

/**
 * interface CliResult {
 *  code: number,
 *  error: ExecException | null,
 *  stdout: string,
 *  stderr: string
 * }
 * @param {string} command
 * @returns Promise<CliResult>
 */
async function cli(command) {
  return new Promise(resolve => {
    exec(command, { encoding: "utf-8" },
      (error, stdout, stderr) => {
        resolve({
          code: error && error.code ? error.code : 0,
          error,
          stdout,
          stderr
        });
      })
  })
}

async function babelCompile(inputFolder, configFile, testFile, outputFile) {
  let fullConfigFile = path.join(__dirname, configFile);
  let fullTestFile = path.join(inputFolder, testFile);
  let fullOutputFile = path.join(outFolder, outputFile || testFile); ;
  let command = `npx babel --config-file ${fullConfigFile} ${fullTestFile} --out-file ${fullOutputFile}`;
  return await cli(command, testFile)
}

async function runProgram(testFile) {
  let fullTestFile = path.join(outFolder, testFile);
  let command = `node --no-warnings ${fullTestFile}`;
  return await cli(command, fullTestFile)
}

module.exports = {
  inputFolder,
  outFolder,
  runTimeInputFolder,
  cli,
  babelCompile,
  runProgram
}
