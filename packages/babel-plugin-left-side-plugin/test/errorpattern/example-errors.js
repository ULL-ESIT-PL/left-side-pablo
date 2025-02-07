module.exports = function ({code, error, stdout, stderr }) {
  return /Syntax.*Error.*Binding.*left/.test(stderr);
}
