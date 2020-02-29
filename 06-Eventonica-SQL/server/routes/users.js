const express = require("express");
const router = express.Router();

const { Users } = require("../../helpers/db/dbFunctions");
const { idGenerator, createValidPropsObj } = require("../../helpers/functions");

router
  .route("/")
  .get((req, res) => {
    Users.getAll()
      .then(res.handle)
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

router
  .route("/:id")
  .get((req, res) => {
    Users.getById(req.params.id)
      .then(res.handle)
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
        .catch(error => {
          console.error(error);
          res.status(404).send(error);
        });
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
        .catch(error => {
          console.error(error);
          res.status(404).send(error);
        });
    }
  })
  .delete((req, res) => {
    Users.deleteById(req.params.id)
      .then(res.handle)
      .catch(error => {
        console.error(error);
        res.status(404).send(error);
      });
  });

module.exports = router;
