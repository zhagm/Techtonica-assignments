const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const morgan = require("morgan");

const { Users, Events } = require("./utils/dbFunctions");
const { idGenerator, createValidPropsObj } = require("./utils/functions");

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARE
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname + "/public")));
app.use(morgan("tiny"));

/* ROUTES */

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ EVENTS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
app
  .route("/events")
  .get((req, res) => {
    let { category, date } = req.query;
    Events.getAll(category, date)
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
    let validKeys = [
      "name",
      "date",
      "category",
      "id",
      "image",
      "description",
      "url",
      "city",
      "venue"
    ];
    let newEventObj = createValidPropsObj(req.body, validKeys);
    if (!newEventObj.name) res.status(400).send("ERROR: Events need a name");
    if (!newEventObj.id) newEventObj.id = idGenerator();
    else {
      Events.createNew(newEventObj)
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
  .route("/events/:id")
  .get((req, res) => {
    Events.getById(req.params.id)
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
    let { id } = req.params;
    let validKeys = [
      "name",
      "date",
      "category",
      "image",
      "description",
      "url",
      "city",
      "venue"
    ];
    let updateEventObj = createValidPropsObj(req.body, validKeys);
    if (!Object.keys(updateEventObj).length)
      res.status(400).send("ERROR: Nothing to update");
    else {
      Events.updateById(id, updateEventObj)
        .then(({ data, error }) => {
          if (error) res.status(400).send(`ERROR: ${error}`);
          else res.status(200).send(data);
        })
        .catch(error => {
          console.error(error);
          res.status(400).send(error);
        });
    }
  })
  .delete((req, res) => {
    Events.deleteById(req.params.id)
      .then(({ data, error }) => {
        if (error) res.status(400).send(`ERROR: ${error}`);
        else res.status(200).send(data);
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
    let validKeys = ["name", "id"];
    let newUserObj = createValidPropsObj(req.body, validKeys);
    if (!newUserObj.name) res.status(400).send("ERROR: Users need a name");
    if (!newUserObj.id) newUserObj.id = idGenerator();
    else {
      Users.createNew(newUserObj)
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
    // can only update or add event to users, not both
    let { id } = req.params;
    let { eventId } = req.body; // if eventId, any other update props ignored
    if (eventId) {
      Users.addPersonalEventById(id, eventId)
        .then(({ data, error }) => {
          if (error) res.status(400).send(`ERROR: ${error}`);
          else res.status(200).send(data);
        })
        .catch(error => res.status(404).send(error));
    } else {
      let validKeys = ["name"];
      let updateEventObj = createValidPropsObj(req.body, validKeys);
      if (!Object.keys(updateEventObj).length)
        res.status(400).send("ERROR: Nothing to update");
      Users.updateById(id, updateEventObj)
        .then(({ data, error }) => {
          if (error) res.status(400).send(`ERROR: ${error}`);
          else res.status(200).send(data);
        })
        .catch(error => res.status(404).send(error));
    }
  })
  .delete((req, res) => {
    Users.deleteById(req.params.id)
      .then(({ data, error }) => {
        if (error) res.status(400).send(`ERROR: ${error}`);
        else res.status(200).send(data);
      })
      .catch(error => res.status(404).send(error));
  });

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
