module.exports = {

  plugins: [
    "@ull-esit-pl/babel-plugin-left-side-plugin",
  ]
};
/* passing options to the plugin. See https://github.com/ULL-ESIT-PL/babel-learning/tree/main/src/scope/non-declared and https://apuntes-pl.vercel.app/topics/babel/scope

const hash = require("object-hash");    // https://www.npmjs.com/package/object-hash
module.exports = function(api) {
  api.cache(true); // you are instructing Babel to cache the computed configuration and reuse it on subsequent builds.
                   // This can significantly improve build performance because Babel doesn't need to re-evaluate the configuration on every build.

  const defaultEnv = {
    plugins: [
      [
        "@ull-esit-pl/babel-plugin-left-side-plugin", { "types": [], hash }
      ]
    ]
  };

  const customEnv = {
    plugins: [
      [
        "@ull-esit-pl/babel-plugin-left-side-plugin", { "types": [], hash }
      ]
    ]
  };

  return {
    env: {
      development: defaultEnv,
      custom: customEnv
    }
  };
};
*/
