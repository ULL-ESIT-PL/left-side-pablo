class Schedule {
  static @@ table(day) {
    return null;
  }
};

Schedule.table(2) = "Class";

console.log(Schedule.table(1)) // null
console.log(Schedule.table(2)) // "Class"