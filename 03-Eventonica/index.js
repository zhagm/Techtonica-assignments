class EventRecommender {
  constructor() {
    this.events = [];
    this.users = [];
  }

  addEvent(name, date, category) {
    this.events.push(new Event(name, date, category));
  }

  addUser(name) {
    this.users.push(new User(name));
  }

  saveUserEvent(user, event) {
    user.addUserEvent(event);
  }

  deleteUser(userId) {
    this.users = this.users.filter(u => u.id !== userId);
  }

  deleteEvent(eventId) {
    this.events = this.events.filter(u => u.id !== eventId);
  }

  findEventsByDate(date) {
    if (date instanceof Date === false) date = new Date(date);
    let datesAreOnSameDay = (first, second) =>
      first.getFullYear() === second.getFullYear() &&
      first.getMonth() === second.getMonth() &&
      first.getDate() === second.getDate();
    return this.events.filter(event => datesAreOnSameDay(date, event.date));
  }

  findEventsbyCategory(category) {
    return this.events.filter(event => event.category === category);
  }
}

class User {
  constructor(name, id) {
    this.name = name;
    this.events = [];
    this.id = id || Math.floor(Math.random() * 100000);
  }
  addUserEvent(event) {
    this.events.push(event);
  }
}

class Event {
  constructor(name, date, category, id) {
    this.name = name;
    this.date = new Date(date);
    this.category = category;
    this.id = id || Math.floor(Math.random() * 100000);
  }
}
