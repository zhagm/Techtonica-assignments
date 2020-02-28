const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const morgan = require("morgan");

const { EventRecommender } = require("./public/eventRecommender");
const { getAllData, updateData } = require("./utils/dbFunctions");
const { Users, Events } = require("./utils/dbFunctions");
const { idGenerator } = require("./utils/functions");

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
      .then(events => res.status(200).send(events || []))
      .catch(err => {
        console.error(err);
        res.status(400).send(err);
      });
  })
  .post((req, res) => {
    let newEventProps = {
      name: req.body.name,
      date: req.body.date,
      category: req.body.category,
      id: req.body.id,
      image: req.body.image,
      description: req.body.description,
      url: req.body.url,
      city: req.body.city,
      venue: req.body.venue,
      dateAdded: Date.now()
    };
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
    Events.getById(req.params.id)
      .then(event =>
        res.status(event ? 200 : 404).send(event || "Event not found.")
      )
      .catch(error => res.status(404).send(error));
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
    Events.deleteById(req.params.id)
      .then(deletedId => {
        res
          .status(deletedId ? 200 : 404)
          .send(deletedId || "ERROR: Event not found");
      })
      .catch(error => res.status(404).send(error));
  });

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ USERS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
app
  .route("/users")
  .get((req, res) => {
    Users.getAll()
      .then(({ data, error }) => {
        if (error) res.status(400).send(`ERROR: ${error}`);
        else res.status(200).send(data);
      })
      .catch(error => {
        console.error(error);
        res.status(400).send(error);
      });
  })
  .post((req, res) => {
    let { name, id } = req.body;
    if (!id) id = idGenerator();
    if (!name) res.status(400).send("ERROR: Users need a name");
    else {
      Users.createNew(name, id)
        .then(({ data, error }) => {
          if (error) res.status(400).send(`ERROR: ${error}`);
          else res.status(201).send(data);
        })
        .catch(error => {
          console.error(error);
          res.status(400).send(error);
        });
    }
  });

app
  .route("/users/:id")
  .get((req, res) => {
    Users.getById(req.params.id)
      .then(({ data, error }) => {
        if (error) res.status(400).send(`ERROR: ${error}`);
        else res.status(200).send(data);
      })
      .catch(error => {
        console.error(error);
        res.status(400).send(error);
      });
  })
  .put((req, res) => {
    let updatesObj = {};
    let { id: userId } = req.params;
    let { name, eventId } = req.body;
    if (name) updatesObj.name = name;
    Users.updateById(userId, updatesObj)
      .then(({ data, error }) => {
        if (error && !eventId && error == "Nothing to update")
          res.status(400).send(`ERROR: ${error}`);
        else if (eventId) return Users.addPersonalEventById(userId, eventId);
        else if (error) res.status(400).send(`ERROR: ${error}`);
        else res.status(200).send(data);
      })
      .then(({ data, error }) => {
        if (error) res.status(400).send(`ERROR: ${error}`);
        else res.status(200).send(data);
      })
      .catch(error => res.status(404).send("ERROR" + error));
  })
  .delete((req, res) => {
    Users.deleteById(req.params.id)
      .then(({ data, error }) => {
        if (error) res.status(400).send(`ERROR: ${error}`);
        else res.status(200).send(data);
      })
      .catch(error => res.status(404).send(error));
  });

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
