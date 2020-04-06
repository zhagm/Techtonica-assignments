const db = require("./dbConfig");
const pgp = require("pg-promise")(); // for helpers

function getAllSightings() {
  return db
    .any("SELECT * FROM sightings")
    .then(sightings => {
      return { data: { sightings } };
    })
    .catch(error => {
      console.error(error);
      return { error };
    });
}

function getAllSpecies() {
  return db
    .any("SELECT * FROM species")
    .then(species => {
      return { data: { species } };
    })
    .catch(error => {
      console.error(error);
      return { error };
    });
}

function getSpeciesById(id) {
  return db
    .any("SELECT * FROM species WHERE id = $1", id)
    .then(([thing]) => {
      if (!thing) return { error: "Species not found" };
      else return { data: { thing } };
    })
    .catch(error => {
      console.error(error);
      return { error };
    });
}

function createNewSighting(sightingProperties) {
  return db
    .query(
      "INSERT INTO sightings(${this:name}) VALUES(${this:csv})",
      sightingProperties
    )
    .then(() =>
      db.any("SELECT * FROM sightings WHERE id = $1", sightingProperties.id)
    )
    .then(([sighting]) => {
      if (!sighting) return { error: "Sighting not created" };
      else return { data: { sighting } };
    })
    .catch(error => {
      console.error("ERROR IS", error);
      return { error: error.detail || error };
    });
}

// function updateSpeciesById(id, updatesObj) {
//   const condition = pgp.as.format(" WHERE id = $1", id);
//   let updateQuery = pgp.helpers.update(updatesObj, null, "things") + condition;
//   return db
//     .any(updateQuery)
//     .then(() => db.any("SELECT * FROM things WHERE id = $1", id))
//     .then(([thing]) => {
//       if (!thing) return { error: "Species not found" };
//       else return { data: { thing } };
//     })
//     .catch(error => {
//       console.error(error);
//       return { error };
//     });
// }

// function deleteSpeciesById(id) {
//   let deletedSpecies;
//   return db
//     .any("SELECT * FROM things WHERE id = $1", id)
//     .then(([thing]) => {
//       if (!thing) return { error: "Species not found" };
//       else {
//         deletedSpecies = thing;
//         return db.any("DELETE FROM things WHERE id = $1", id);
//       }
//     })
//     .then(res => {
//       if (res.error) return res;
//       else return { data: { thing: deletedSpecies } };
//     })
//     .catch(error => {
//       console.error(error);
//       return { error };
//     });
// }

// async function saveSpeciesEvent(thingId, eventId) {
//   try {
//     const [thing] = await db.any(
//       "SELECT * FROM things WHERE id = $1;",
//       thingId
//     );
//     const [event] = await db.any(
//       "SELECT * FROM events WHERE id = $1;",
//       eventId
//     );
//     const [
//       saved
//     ] = await db.any(
//       "SELECT * FROM thing_events WHERE thing_id = $1 AND event_id = $2;",
//       [thingId, eventId]
//     );
//     if (thing && event && !saved) {
//       return db
//         .any("INSERT INTO thing_events (thing_id, event_id) VALUES ($1, $2);", [
//           thingId,
//           eventId
//         ])
//         .then(() => {
//           return { data: { thing, event } };
//         });
//     } else {
//       let error;
//       if (saved) error = "Species already saved event";
//       else if (!thing || !event) {
//         error = `${thing ? "" : "Species "}${
//           event ? "" : thing ? "Event" : " and event"
//         } do${!thing && !event ? "" : "es"} not exist`;
//       }
//       return { error };
//     }
//   } catch (error) {
//     console.error(error);
//     return { error };
//   }
// }

module.exports = {
  Species: {
    getAll: getAllSpecies,
    getById: getSpeciesById
  },
  Sightings: {
    getAll: getAllSightings,
    // getById: getSightingsById,
    createNew: createNewSighting
  }
  // createNew: createNewSpecies,
  // updateById: updateSpeciesById,
  // deleteById: deleteSpeciesById,
  // saveSpeciesEvent
};
