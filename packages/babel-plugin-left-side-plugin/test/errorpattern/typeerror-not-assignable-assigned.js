module.exports = function ({code, error, stdout, stderr }) {
  return /Assigning.*to.*an.*ordinary.*Function/.test(stderr);
}
