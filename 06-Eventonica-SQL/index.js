const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const pgp = require("pg-promise")();
const db = require("./utils/db");

// format for myself
const morgan = require("morgan");

const { EventRecommender } = require("./public/eventRecommender");
const { getAllData, updateData } = require("./utils/dbFunctions");
const { Users, Events } = require("./utils/dbFunctions");
const {
  categoryFilterEvents,
  dateFilterEvents,
  idGenerator
} = require("./utils/functions");

const app = express();
const port = 3000;

// MIDDLEWARE
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname + "/public")));
app.use(morgan("tiny"));

let er;

getAllData().then(data => {
  let { users, events } = data;
  er = new EventRecommender(users || [], events || []);
});

// ROUTES
//    EVENTS
app
  .route("/events")
  .get((req, res) => {
    let { category, date } = req.query;
    Events.getAll(category, date)
      .then(events => {
        res.status(200).send(events || []);
      })
      .catch(error => {
        console.error(error);
      });
    // let { events } = er;
    // let { category, date } = req.query;
    // events = dateFilterEvents(date, categoryFilterEvents(category, events));
    // res.status(200).send(events || []);
    // .get((req, res) => {
    //   Users.getAll()
    //     .then(users => {
    //       res.status(200).send(users || []);
    //     })
    //     .catch(error => {
    //       console.error(error);
    //     });
    // })
  })
  .post((req, res) => {
    let {
      name,
      date,
      category,
      id,
      image,
      description,
      url,
      city,
      venue,
      dateAdded
    } = req.body;
    if (name) {
      let newEvent = er.addEvent(
        name,
        date,
        category || "",
        id,
        image,
        description,
        url,
        city,
        venue,
        dateAdded
      );
      updateData(er.events, "events");
      res.status(201).send(newEvent);
    } else {
      res.status(400).send("ERROR: Events need a name");
    }
    /*
    db.none(
      "INSERT INTO users(first_name, last_name, age) VALUES(${name.first}, $<name.last>, $/age/)",
      {
        name: { first: "John", last: "Dow" },
        age: 30
      }
    );
     */
  });

app
  .route("/events/:id")
  .get((req, res) => {
    let event = er.getEventById(req.params.id);
    if (event !== -1) res.status(200).send(event);
    else res.status(404).send("ERROR: Event not found");
  })
  .put((req, res) => {
    let { id } = req.params;
    let event = er.getEventById(id);
    if (event === -1) res.status(404).send("ERROR: Event not found");
    let { name, date, category } = req.body;
    updatedEvent = { ...event };
    if (name) updatedEvent.name = name;
    if (date) updatedEvent.date = date;
    if (category) updatedEvent.category = category;
    er.updateEvent(id, updatedEvent);
    updateData(er.events, "events");
    res.status(200).send(updatedEvent);
  })
  .delete((req, res) => {
    let { id } = req.params;
    let deleted = er.deleteEvent(id);
    if (deleted) {
      updateData(er.events, "events");
      res.status(200).send(deleted);
    } else {
      res.status(400).send("ERROR: Event not found");
    }
  });

//    USERS
app
  .route("/users")
  .get((req, res) => {
    Users.getAll()
      .then(users => {
        res.status(200).send(users || []);
      })
      .catch(error => {
        console.error(error);
      });
  })
  .post((req, res) => {
    let { name, id } = req.body;
    if (!name) res.status(400).send("ERROR: users need a name");
    if (!id) id = idGenerator();
    else {
      Users.createNew(name, id)
        .then(user => {
          if (user) res.status(201).send(user);
          else res.status(404).send();
        })
        .catch(err => res.status(400).send(err));
    }
  });

app
  .route("/users/:id")
  .get((req, res) => {
    Users.getById(req.params.id)
      .then(user =>
        res.status(user ? 200 : 404).send(user || "User not found.")
      )
      .catch(error => res.status(404).send(error));
  })
  .put((req, res) => {
    let updatesObj = {};
    let { id: userId } = req.params;
    let { name, eventId } = req.body;
    if (name) updatesObj.name = name;
    Users.updateById(userId, updatesObj)
      .then(user => {
        if (!eventId) {
          res.status(user ? 200 : 404).send(user || "ERROR: User not found");
        } else return Users.addPersonalEventById(userId, eventId);
      })
      .then(data => {
        res.status(200).send(data);
      })
      .catch(error => res.status(404).send(error));
    // let { id } = req.params;
    // let { name, eventId } = req.body;
    // let user = er.getUserById(id);
    // if (user === -1) res.status(400).send("ERROR: User not found");
    // if (eventId) {
    //   if (!user.personalEvents.filter(e => e.id == eventId).length)
    //     er.saveUserEvent(id, eventId);
    // }
    // let updatedUser = { ...user };
    // if (name) updatedUser.name = name;
    // er.updateUser(id, updatedUser);
    // updateData(er.users, "users");
    // res.status(200).send(updatedUser);
  })
  .delete((req, res) => {
    Users.deleteById(req.params.id)
      .then(deletedId => {
        res
          .status(deletedId ? 200 : 404)
          .send(deletedId || "ERROR: User not found");
      })
      .catch(error => res.status(404).send(error));
  });

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = {
  db
};
