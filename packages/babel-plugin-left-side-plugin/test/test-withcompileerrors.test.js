const { exec, execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const inputFolder = path.join(__dirname, "compileerror");

/**
 * interface CliResult {
 *  code: number,
 *  error: ExecException | null,
 *  stdout: string,
 *  stderr: string
 * }
 * @param {*} configFile string
 * @param {*} testFile string
 * @returns Promise<CliResult>
 */
async function cli(configFile, testFile) {
  return new Promise(resolve => {
    let fullConfigFile = path.join(__dirname, configFile);
    let fullTestFile = path.join(inputFolder, testFile);
    exec(`npx babel --config-file ${fullConfigFile} ${fullTestFile}`, { encoding: "utf-8" },
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

async function main() {
  const input = fs.readdirSync(inputFolder, { encoding: "utf-8" });
  let configFile = "babel.config.js";

  for (let testFile of input) {
    let errorPattern = require(path.join(__dirname, 'errorpattern', testFile));
    test(testFile, async (done) => {
      try {
        let {code, error, stdout, stderr } = await cli(configFile, testFile)
        expect(errorPattern({code, error, stdout, stderr })).toBe(true);
        done();
      } catch (e) {
        console.log(e.message);
      }
    })
  }
}

main();
