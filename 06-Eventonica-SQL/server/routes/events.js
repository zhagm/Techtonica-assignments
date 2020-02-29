const express = require("express");
const router = express.Router();

const { Events } = require("../../helpers/db/dbFunctions");
const { idGenerator, createValidPropsObj } = require("../../helpers/functions");

router
  .route("/")
  .get((req, res) => {
    let { category, date } = req.query;
    Events.getAll(category, date)
      .then(res.handle)
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

router
  .route("/:id")
  .get((req, res) => {
    Events.getById(req.params.id)
      .then(res.handle)
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
      .then(res.handle)
      .catch(error => res.status(404).send(error));
  });

module.exports = router;
