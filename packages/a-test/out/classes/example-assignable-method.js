const {
  assign,
  functionObject
} = require("@ull-esit-pl/babel-plugin-left-side-support");
class EventManager {
  events = functionObject(function (key) {
    return null;
  }, [undefined]);
  otherMethod() {
    return "some value";
  }
}
;
let manager = new EventManager();
assign(manager.events, ["event"], () => console.log("Im doing something"), []);
console.log(manager.events()); // null
manager.events("event")(); // Im doing something

let otherManager = new EventManager();
// They must not be the same instance
console.log(otherManager.events !== manager.events);