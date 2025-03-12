const {
  assign,
  functionObject
} = require("@ull-esit-pl/babel-plugin-left-side-support");
class Schedule {
  static table = functionObject(function (day) {
    return null;
  });
}
;
assign(Schedule.table, [2], "Class", []);
console.log(Schedule.table(1));
console.log(Schedule.table(2));