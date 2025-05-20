const {
  assign,
  functionObject
} = require("babel-plugin-left-side-support");
class Schedule {
  static table = functionObject(function (day) {
    return null;
  }, [undefined]);
}
;
assign(Schedule.table, [2], "Class", []);
console.log(Schedule.table(1)); // null
console.log(Schedule.table(2)); // "Class"