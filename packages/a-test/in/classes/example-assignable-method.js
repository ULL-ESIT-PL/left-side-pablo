class EventManager {
  @@ events(key) {
    return null;
  }

  otherMethod() {
    return "some value";
  }
};

let manager = new EventManager();
manager.events("event") = () => console.log("Im doing something");

console.log(manager.events()) // null
manager.events("event")() // Im doing something

let otherManager = new EventManager();
// They must not be the same instance
console.log(otherManager.events !== manager.events)