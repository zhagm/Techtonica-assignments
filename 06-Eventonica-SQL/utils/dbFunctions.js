const fs = require("fs");
const dataFilePath = __dirname + "/data.json";
const db = require("./db");

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
      return [...events];
    })
    .catch(function(error) {
      console.error(error);
    });
}

// USERS
function getAllUsers() {
  return db
    .any("SELECT * FROM users ")
    .then(users => {
      return [...users];
    })
    .catch(function(error) {
      console.error(error);
    });
}

function getUserById(id) {
  return db
    .any("SELECT * FROM users WHERE id = $1", id)
    .then(user => user[0])
    .catch(error => {
      console.error(error);
      return;
    });
}

function createNewUser(name, id) {
  return db
    .any("INSERT INTO users (name, id) VALUES($1, $2)", [name, id])
    .then(user => {
      return getUserById(id);
    })
    .catch(error => {
      console.error(error);
      return "ERROR";
    });
}

function updateUserById(id, updatesObj) {
  let { name } = updatesObj; // Will set up with more properties later
  return db
    .any("UPDATE users SET name = $1 WHERE id = $2", [name, id])
    .then(user => user)
    .catch(error => {
      console.error(error);
      return;
    });
}

function deleteUserById(id) {
  return getUserById(id)
    .then(user => {
      if (!user) return;
      return db.any("DELETE FROM users WHERE id = $1", id);
    })
    .then(wasDeleted => (wasDeleted ? id : undefined))
    .catch(err => {
      console.error(err);
      return;
    });
}

async function addPersonalEventToUserById(userId, eventId) {
  try {
    const user = await db.any(
      "SELECT COUNT(*) FROM users WHERE id = $1;",
      userId
    );
    const event = await db.any(
      "SELECT COUNT(*) FROM events WHERE id = $1;",
      eventId
    );
    const saved = await db.any(
      "SELECT COUNT(*) FROM saved_events WHERE user_id = $1 AND event_id = $2;",
      [userId, eventId]
    );
    console.log({ user });
    console.log({ event });
    console.log({ saved });
    if (user.count == 1 && event.count == 1 && !saved.count == 0) {
      console.log("COMPLETED INSIDE addPersonalEventById");
      // I think this part works? Can't be sure until events get works DONE FOR THE NIGHT.
      return db.any(
        "INSERT INTO saved_events (user_id, event_id, date_saved) VALUES ($1, $2, $3);",
        [userId, eventId, Date.now()]
      );
    }
  } catch (error) {
    console.error(error);
    return;
  }
}

module.exports = {
  getAllData,
  updateData,
  Events: {
    getAll: getAllEvents
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
