class EventRecommender {
  constructor(users, events) {
    this.events = events || [];
    this.users = users || [];
  }

  addEvent(name, date, category, id) {
    let eventById = this.getEventById(id);
    if (eventById === -1) {
      let newEvent = new Event(name, date, category, id);
      this.events.push(newEvent);
      return newEvent;
    } else {
      return eventById;
    }
  }

  getEventById(id) {
    let filtered = this.events.filter(event => id == event.id);
    if (filtered.length) return filtered[0];
    return -1;
  }

  updateEvent(id, updatedEvent) {
    this.events = this.events.map(event => {
      if (event.id === id) return updatedEvent;
      return event;
    });
    return this.events;
  }

  addUser(name, id) {
    if (id && this.users.filter(u => u.id == id).length) return;
    let newUser = new User(name, id);
    this.users.push(newUser);
    return newUser;
  }

  getUserById(id) {
    let filtered = this.users.filter(user => id == user.id);
    if (filtered.length) return filtered[0];
    return -1;
  }

  updateUser(id, updatedUser) {
    this.users = this.users.map(user => {
      if (user.id == id) return updatedUser;
      return user;
    });
    return this.users;
  }

  saveUserEvent(userId, eventId) {
    let user = this.users.filter(u => u.id == userId)[0];
    let event = this.events.filter(e => e.id == eventId)[0];
    if (!user.personalEvents.includes(event)) {
      user.personalEvents.push(event);
      return true;
    }
    return false;
  }

  deleteUser(userId) {
    let deleted;
    this.users = this.users.filter(user => {
      if (user.id == userId) {
        deleted = user;
        return false;
      }
      return user.id != userId;
    });
    return deleted;
  }

  deleteEvent(eventId) {
    let deleted;
    this.events = this.events.filter(event => {
      if (event.id == eventId) {
        deleted = event;
        return false;
      }
      return event.id != eventId;
    });
    return deleted;
  }

  findEventsByDate(date) {
    if (date instanceof Date === false) date = new Date(date);
    let datesAreOnSameDay = (first, second) =>
      first.getFullYear() === second.getFullYear() &&
      first.getMonth() === second.getMonth() &&
      first.getUTCDate() === second.getUTCDate();
    return this.events.filter(event =>
      datesAreOnSameDay(date, new Date(event.date))
    );
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
}

class Event {
  constructor(name, date, category, id) {
    this.name = name;
    this.date = new Date(date);
    this.category = category;
    this.id = id || Math.floor(Math.random() * 100000);
  }
}

if (typeof module != "undefined") {
  module.exports = { EventRecommender, User, Event };
}
