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
// async function getEvents(category, date) {
//   let events = await db
//     .any("SELECT * FROM events")
//     .then(data => {
//       for (let item of data) {
//         console.log({ item });
//       }
//     })
//     .catch(function(error) {
//       console.error(error);
//     });
//   // events = dateFilterEvents(date, categoryFilterEvents(category, events));
//   return events;
// }

// USERS
function getAllUsers() {
  return db
    .any("SELECT * FROM users")
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

function updateUserById(id, updatesObj) {
  let { name } = updatesObj; // Will set up with more properties later
  return db
    .any("UPDATE users SET name = $1 WHERE id = $2", [name, id])
    .then(user => user)
    .catch(error => {
      console.error(error);
      return;
    });
  // db.none('INSERT INTO users(first_name, last_name, age) VALUES(${name.first}, $<name.last>, $/age/)', {
  //     name: {first: 'John', last: 'Dow'},
  //     age: 30
  // }); Look into
}

function deleteUserById(id) {
  return db
    .any("DELETE FROM users WHERE id = $1", id)
    .then(() => id)
    .catch(console.error);
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
      // I thin this part works? Can't be sure until events get works DONE FOR THE NIGHT.
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
  // getEvents,
  Users: {
    getAll: getAllUsers,
    // createNew: createNewUser,
    getById: getUserById,
    updateById: updateUserById,
    deleteById: deleteUserById,
    addPersonalEventById: addPersonalEventToUserById
  }
};
