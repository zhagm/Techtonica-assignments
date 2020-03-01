const db = require("./dbConfig");
const pgp = require("pg-promise")(); // for helpers

// EVENTS
function getAllEvents(category, date) {
  let selectQuery = "SELECT * FROM events";
  if (category) selectQuery += ` WHERE category = '${category}'`;
  else if (date)
    selectQuery += ` ${category ? "AND " : "WHERE "}date = '${date}'`;
  console.log({ selectQuery });
  return db
    .any(selectQuery)
    .then(events => {
      console.log({ events });
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

function updateEventById(id, updatesObj) {
  const condition = pgp.as.format(" WHERE id = $1", id);
  let updateQuery = pgp.helpers.update(updatesObj, null, "events") + condition;
  return db
    .any(updateQuery)
    .then(() => db.any("SELECT * FROM events WHERE id = $1", id))
    .then(([event]) => {
      if (!event) return { error: "Event not found" };
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

module.exports = {
  getAll: getAllEvents,
  getById: getEventById,
  createNew: createNewEvent,
  updateById: updateEventById,
  deleteById: deleteEventById
};
