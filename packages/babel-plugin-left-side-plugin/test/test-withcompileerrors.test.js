const fs = require("fs");
const path = require("path");
const { inputFolder, babelCompile} = require("./utils");

async function testCompileTimeErrors() {
  const input = fs.readdirSync(inputFolder, { encoding: "utf-8" });
  let configFile = "babel.config.js";

  for (let testFile of input) {
    let errorPattern = require(path.join(__dirname, 'errorpattern', testFile));
    test(testFile, async (done) => {
      try {
        let {code, error, stdout, stderr } = await babelCompile(inputFolder, configFile, testFile)
        expect(errorPattern({code, error, stdout, stderr })).toBe(true);

        done();
      } catch (e) {
        console.log(e.message);
      }
    })
  }
}

testCompileTimeErrors();
