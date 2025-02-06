module.exports = function (error) {
  return /Syntax.*Error.*Binding.*left/.test(error);
}
