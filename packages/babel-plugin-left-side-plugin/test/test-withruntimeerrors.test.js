const fs = require("fs");
const path = require("path");

const { runTimeInputFolder, cli, inputFolder, outFolder, babelCompile, runProgram} = require("./utils");

async function testRunTimeErrors() {
  const input = fs.readdirSync(runTimeInputFolder, { encoding: "utf-8" });
  let configFile = "babel.config.js";

  for (let testFile of input) {
    let errorPattern = require(path.join(__dirname, 'errorpattern', testFile));
    test(testFile, async (done) => {
      try {
        console.log("testFile: ", testFile);
        let compileResult = await babelCompile(runTimeInputFolder, configFile, testFile)
        expect(compileResult.code).toBe(0)

        //let {code, error, stdout, stderr } = await runProgram(testFile)
        //expect(errorPattern({code, error, stdout, stderr })).toBe(true);
        done();
      } catch (e) {
        console.log(e.message);
      }
    })
  }
}

testRunTimeErrors();

