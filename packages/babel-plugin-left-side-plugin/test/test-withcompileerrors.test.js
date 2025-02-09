const { exec, execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const inputFolder = path.join(__dirname, "compileerror");
const outFolder = path.join(__dirname, "out");

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

async function babelCompile(configFile, testFile, outputFile) {
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

async function testCompileTimeErrors() {
  const input = fs.readdirSync(inputFolder, { encoding: "utf-8" });
  let configFile = "babel.config.js";

  for (let testFile of input) {
    let errorPattern = require(path.join(__dirname, 'errorpattern', testFile));
    test(testFile, async (done) => {
      try {
        let {code, error, stdout, stderr } = await babelCompile(configFile, testFile)
        expect(errorPattern({code, error, stdout, stderr })).toBe(true);

        done();
      } catch (e) {
        console.log(e.message);
      }
    })
  }
}

testCompileTimeErrors();

/*
const runTimeInputFolder = path.join(__dirname, "runtimeerror");

async function testRunTimeErrors() {
  const input = fs.readdirSync(runTimeInputFolder, { encoding: "utf-8" });
  let configFile = "babel.config.js";

  for (let testFile of input) {
    let errorPattern = require(path.join(__dirname, 'errorpattern', testFile));
    test(testFile, async (done) => {
      try {
        let compileResult = await babelCompile(configFile, testFile)
        expect(compileResult.code).toBe(0)

        let {code, error, stdout, stderr } = await runProgram(testFile)
        expect(errorPattern({code, error, stdout, stderr })).toBe(true);
        done();
      } catch (e) {
        console.log(e.message);
      }
    })
  }
}
*/
