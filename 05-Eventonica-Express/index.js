const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const dataFilePath = "./data.json";
// const { EventRecommender } = require("./public/eventRecommender.js");
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname + "/public")));

// let er = new EventRecommender();

function writeToFile(updatedObj, property) {
  getAllData().then(data => {
    data = { ...data, property: updatedObj };
    fs.writeFile(dataFilePath, JSON.stringify(data), err => {
      console.error("ERROR: ", err);
    });
  });
}

function getAllData(cb) {
  return new Promise((resolve, reject) => {
    fs.readFile(dataFilePath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
}

function getAllEvents() {
  return new Promise((resolve, reject) => {
    getAllData()
      .then(data => resolve(data.events))
      .catch(err => reject(err));
  });
}

function getEventById(id) {
  return new Promise((resolve, reject) => {
    getAllEvents()
      .then(events => events.filter(event => event.id === id)[0])
      .then(event => {
        if (event) resolve(event);
        else reject(`Event with id '${id}' found`);
      })
      .catch(err => reject(err));
  });
}

app.get("/events", (req, res) => {
  getAllEvents()
    .then(events => res.status(200).send(events))
    .catch(err => res.status(400).send("Error!"));
});

app
  .route("/events/:id")
  .get((req, res) => {
    getEventById(req.params.id)
      .then(event => res.status(200).send(event))
      .catch(err => res.status(404).send(err));
  })
  .put((req, res) => {
    console.log("REQUEST BOD: ", req.body);
    getEventById(req.params.id)
      .then(event => {
        let { name, date } = req.body;
        updatedEvent = { ...event };
        if (name) updatedEvent.name = name;
        if (date) updatedEvent.date = date;
        return updatedEvent;
      })
      .then(newEvent => {
        getAllEvents().then(events => {
          events = { ...events, newEvent };
          // writeToFile(events, "events");
          console.log("EVENTS IS NOW: ", events);
          res.status(200).send(newEvent);
        });
      })
      .catch(err => res.status(404).send(err));
  })
  .post(() => {})
  .delete(() => {});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
