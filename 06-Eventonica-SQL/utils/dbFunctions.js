const fs = require("fs");
const dataFilePath = __dirname + "/data.json";
const db = require("./db");
const { getSetString } = require("./functions");

function getAllData() {
  return new Promise((resolve, reject) => {
    fs.readFile(dataFilePath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
}

function updateData(updatedItem, property) {
  getAllData().then(data => {
    data[property] = updatedItem;
    fs.writeFile(dataFilePath, JSON.stringify(data), err => {
      if (err) console.error("ERROR: ", err);
    });
  });
}

// EVENTS
function getAllEvents(category, date) {
  let selectQuery = "SELECT * FROM events";
  if (category) {
    selectQuery += ` WHERE category = '${category}'`;
  }
  return db
    .any(selectQuery)
    .then(events => {
      return { data: { events } };
    })
    .catch(error => {
      console.error(error);
      return { error };
    });
}

function getEventById(id) {
  return db
    .any("SELECT * FROM events WHERE id = $1", id)
    .then(([event]) => {
      if (!event) return { error: "Event not found" };
      else return { data: { event } };
    })
    .catch(error => {
      console.error(error);
      return { error };
    });
}

function createNewEvent(eventProperties) {
  return db
    .query(
      "INSERT INTO events(${this:name}) VALUES(${this:csv})",
      eventProperties
    )
    .then(() =>
      db.any("SELECT * FROM events WHERE id = $1", eventProperties.id)
    )
    .then(([event]) => {
      if (!event) return { error: "User not created" };
      else return { data: { event } };
    })
    .catch(error => {
      console.error(error);
      return { error };
    });
}

function deleteEventById(id) {
  let deletedEvent;
  return db
    .any("SELECT * FROM events WHERE id = $1", id)
    .then(([event]) => {
      if (!event) return { error: "Event not found" };
      else {
        deletedEvent = event;
        return db.any("DELETE FROM events WHERE id = $1", id);
      }
    })
    .then(res => {
      if (res.error) return res;
      else return { data: { event: deletedEvent } };
    })
    .catch(error => {
      console.error(error);
      return { error };
    });
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ USERS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
function getAllUsers() {
  return db
    .any("SELECT * FROM users")
    .then(users => {
      return { data: { users } };
    })
    .catch(error => {
      console.error(error);
      return { error };
    });
}

function getUserById(id) {
  return db
    .any("SELECT * FROM users WHERE id = $1", id)
    .then(([user]) => {
      if (!user) return { error: "User not found" };
      else return { data: { user } };
    })
    .catch(error => {
      console.error(error);
      return { error };
    });
}

function createNewUser(userProperties) {
  return db
    .query(
      "INSERT INTO users(${this:name}) VALUES(${this:csv})",
      userProperties
    )
    .then(() => db.any("SELECT * FROM users WHERE id = $1", userProperties.id))
    .then(([user]) => {
      if (!user) return { error: "User not created" };
      else return { data: { user } };
    })
    .catch(error => {
      console.error(error);
      return { error };
    });
}

function updateUserById(id, updatesObj) {
  let setString = getSetString(updatesObj);
  if (!setString) return Promise.resolve({ error: "Nothing to update" });
  return db // NOTE: template strings potentially buggy with pg-promises
    .any(`UPDATE users SET ${setString} WHERE id = '${id}'`)
    .then(() => db.any("SELECT * FROM users WHERE id = $1", id))
    .then(([user]) => {
      if (!user) return { error: "User not found" };
      else return { data: { user } };
    })
    .catch(error => {
      console.error(error);
      return { error };
    });
}

function deleteUserById(id) {
  let deletedUser;
  return db
    .any("SELECT * FROM users WHERE id = $1", id)
    .then(([user]) => {
      if (!user) return { error: "User not found" };
      else {
        deletedUser = user;
        return db.any("DELETE FROM users WHERE id = $1", id);
      }
    })
    .then(res => {
      if (res.error) return res;
      else return { data: { user: deletedUser } };
    })
    .catch(error => {
      console.error(error);
      return { error };
    });
}

async function addPersonalEventToUserById(userId, eventId) {
  try {
    const [user] = await db.any("SELECT * FROM users WHERE id = $1;", userId);
    const [event] = await db.any(
      "SELECT * FROM events WHERE id = $1;",
      eventId
    );
    const [
      saved
    ] = await db.any(
      "SELECT * FROM saved_events WHERE user_id = $1 AND event_id = $2;",
      [userId, eventId]
    );
    if (user && event && !saved) {
      return db
        .any("INSERT INTO saved_events (user_id, event_id) VALUES ($1, $2);", [
          userId,
          eventId
        ])
        .then(() => {
          return { data: { user: "USER", event } };
        });
    } else {
      let error;
      if (saved) error = "User already saved event";
      else if (!user || !event) {
        error = `${user ? "" : "User "}${
          event ? "" : user ? "Event" : " and event"
        } do${!user && !event ? "" : "es"} not exist`;
      }
      return { error };
    }
  } catch (error) {
    console.error(error);
    return { error };
  }
}

module.exports = {
  getAllData,
  updateData,
  Events: {
    getAll: getAllEvents,
    createNew: createNewEvent,
    getById: getEventById,
    deleteById: deleteEventById
  },
  Users: {
    getAll: getAllUsers,
    createNew: createNewUser,
    getById: getUserById,
    updateById: updateUserById,
    deleteById: deleteUserById,
    addPersonalEventById: addPersonalEventToUserById
  }
};
