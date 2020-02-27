const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { EventRecommender } = require("./public/eventRecommender");
const { getAllData, updateData } = require("./utils/dbFunctions");
const { categoryFilterEvents, dateFilterEvents } = require("./utils/functions");
const morgan = require("morgan");

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
    let { events } = er;
    let { category, date } = req.query;
    events = dateFilterEvents(date, categoryFilterEvents(category, events));
    res.status(200).send(events || []);
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
    let { users } = er;
    res.status(200).send(users || []);
  })
  .post((req, res) => {
    let { name, id } = req.body;
    if (!name) res.status(400).send("ERROR: users need a name");
    else {
      let newUser = er.addUser(name, id);
      if (newUser) {
        updateData(er.users, "users");
        res.status(201).send(newUser);
      } else {
        res.status(400).send("ERROR: user with that ID already exists");
      }
    }
  });

app
  .route("/users/:id")
  .get((req, res) => {
    let user = er.getUserById(req.params.id);
    if (user !== -1) res.status(200).send(user);
    else res.status(404).send("ERROR: User not found");
  })
  .put((req, res) => {
    let { id } = req.params;
    let { name, eventId } = req.body;
    let user = er.getUserById(id);
    if (user === -1) res.status(400).send("ERROR: User not found");
    if (eventId) {
      if (!user.personalEvents.filter(e => e.id == eventId).length)
        er.saveUserEvent(id, eventId);
    }
    let updatedUser = { ...user };
    if (name) updatedUser.name = name;
    er.updateUser(id, updatedUser);
    updateData(er.users, "users");
    res.status(200).send(updatedUser);
  })
  .delete((req, res) => {
    let { id } = req.params;
    let deleted = er.deleteUser(id);
    if (deleted) {
      updateData(er.users, "users");
      res.status(200).send(deleted);
    } else res.status(400).send("ERROR: User not found");
  });

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
