const express = require("express");
const router = express.Router();

//  /api/events

router
  .route("/")
  .get((req, res) => {
    let { events } = er;
    res.status(200).send(events);
  })
  .post((req, res) => {
    let { name, date, id, category } = req.body;
    if (!name || !date)
      res.status(400).send("ERROR: Events need a name and date");
    else {
      let newEvent = er.addEvent(name, date, category || "", id);
      res.status(200).send(newEvent);
    }
  });

router
  .route("/:id")
  .get((req, res) => {
    let event = er.getEventById(req.params.id);
    if (event !== -1) res.status(200).send(event);
    else res.status(404).send("ERROR: Event not found");
  })
  .put((req, res) => {
    let { id } = req.params;
    let event = er.getEventById(id);
    if (event === -1) res.status(400).send("ERROR: Event not found");
    let { name, date, category } = req.body;
    updatedEvent = { ...event };
    if (name) updatedEvent.name = name;
    if (date) updatedEvent.date = date;
    if (category) updatedEvent.category = category;
    er.updateEvent(id, updatedEvent);
    res.status(200).send(updatedEvent);
  })
  .delete((req, res) => {
    let { id } = req.params;
    let deleted = er.deleteEvent(id);
    if (deleted) res.status(200).send(deleted);
    else res.status(400).send("ERROR: Event not found");
  });

module.exports = router;
