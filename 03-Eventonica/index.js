class EventRecommender {
  constructor() {
    this.events = [];
    this.users = [];
  }

  addEvent(name, date, category) {
    let newEvent = new Event(name, date, category);
    this.events.push(newEvent);
    return newEvent;
  }

  addUser(name) {
    let newUser = new User(name);
    this.users.push(newUser);
    return newUser;
  }

  getUserById(id) {
    let filtered = this.users.filter(user => id === user.id);
    if (filtered.length) return filtered[0];
    return -1;
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
      first.getUTCDate() === second.getUTCDate();
    return this.events.filter(event => datesAreOnSameDay(date, event.date));
  }

  findEventsByCategory(category) {
    return this.events.filter(event => event.category === category);
  }
}

class User {
  constructor(name, id) {
    this.name = name;
    this.personalEvents = [];
    this.id = id || Math.floor(Math.random() * 100000);
  }
  addUserEvent(event) {
    this.personalEvents.push(event);
  }
}

class Event {
  constructor(name, date, category, id) {
    this.title = name;
    this.date = new Date(date);
    this.category = category;
    this.id = id || Math.floor(Math.random() * 100000);
  }
}

module.exports = { EventRecommender, User, Event };
