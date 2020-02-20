describe("EventRecommender", () => {
  const { EventRecommender, User, Event } = require("../index.js"); // Update with your class names and file name
  let er;

  beforeEach(() => {
    er = new EventRecommender();
  });

  describe("addEvent", () => {
    it("adds a new Event to the system", () => {
      er.addEvent("Change Me");
      expect(er.events.length).toEqual(1);
      expect(er.events[0].name).toEqual("Change Me"); // what are some other things you can test?
    });
  });

  describe("addUser", () => {
    it("adds a new User to the system", () => {
      er.addUser("Change Me");
      expect(er.users.length).toEqual(1);
    });
  });

  describe("saveUserEvent", () => {
    it("adds an event to a user's personal event array", () => {
      let event = er.addEvent("Make a new event");
      let user = er.addUser("Make a new user");
      er.saveUserEvent(user, event); // change these to match your method signature
      expect(user.personalEvents.length).toEqual(1);
    });
  });

  describe("deleteUser", () => {
    it("removes a User from the system", () => {
      let userToDelete = er.addUser("Willbe Deleted");
      er.deleteUser(userToDelete.id);
      expect(er.users.length).toEqual(0);
    });
  });

  describe("deleteEvent", () => {
    it("removes the event from the system", () => {
      let eventToDelete = er.addEvent("A new event that you will delete later");
      er.deleteEvent(eventToDelete.id);
      expect(er.events.length).toEqual(0);
    });
  });

  describe("findEventsByDate", () => {
    it("returns an array of only the events that are on a specified date", () => {
      let febSecond = new Date("2020-02-02");
      let testEvents = [
        {
          name: "Grandpa's fake 80th Birthday",
          date: "2020-02-02T03:24:00",
          category: "Birthday"
        },
        { name: "February Second", date: febSecond, category: "Date" },
        {
          name: "Someone else's birthday",
          date: "2020-02-10",
          category: "Birthday"
        },
        { name: "Today", date: Date.now(), category: "Date" }
      ];
      testEvents.forEach(obj => er.addEvent(obj.name, obj.date, obj.category));
      let febSecondEvents = er.findEventsByDate(febSecond);
      expect(febSecondEvents.length).toEqual(2);
    });
  });

  describe("findEventsByCategory", () => {
    it("returns an array of only the events taht are of a specified category", () => {
      let testEvents = [
        {
          name: "Grandpa's fake 80th Birthday",
          date: "2020-02-02T03:24:00",
          category: "Birthday"
        },
        { name: "February Second", date: "2020-02-02", category: "Date" },
        {
          name: "Someone else's birthday",
          date: "2020-02-10",
          category: "Birthday"
        },
        { name: "Today", date: Date.now(), category: "Date" }
      ];
      testEvents.forEach(obj => er.addEvent(obj.name, obj.date, obj.category));
      let birthdays = er.findEventsByCategory("Birthday");
      expect(birthdays.length).toEqual(2);
    });
  });

  describe("getUserById", () => {
    it("returns the user that matches the id, if no user with that id exists, it returns -1", () => {
      let { id } = er.addUser("Zhag");
      let userToFind = er.getUserById(id);
      expect(userToFind.name).toEqual("Zhag");
    });
  });
});
