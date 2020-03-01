const db = require("./dbConfig");
const pgp = require("pg-promise")(); // for helpers

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
  const condition = pgp.as.format(" WHERE id = $1", id);
  let updateQuery = pgp.helpers.update(updatesObj, null, "users") + condition;
  return db
    .any(updateQuery)
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
      "SELECT * FROM user_events WHERE user_id = $1 AND event_id = $2;",
      [userId, eventId]
    );
    if (user && event && !saved) {
      return db
        .any("INSERT INTO user_events (user_id, event_id) VALUES ($1, $2);", [
          userId,
          eventId
        ])
        .then(() => {
          return { data: { user, event } };
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
  getAll: getAllUsers,
  getById: getUserById,
  createNew: createNewUser,
  updateById: updateUserById,
  deleteById: deleteUserById,
  addPersonalEventById: addPersonalEventToUserById
};
