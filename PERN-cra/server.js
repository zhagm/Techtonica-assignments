const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const app = express();
const router = express.Router();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "build")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const { Species, Sightings } = require("./helpers/db/dbFunctions");
const { createValidPropsObj } = require("./helpers/functions");

app.route("/species").get((req, res) => {
  Species.getAll().then(species => res.send(JSON.stringify(species)));
});

app
  .route("/sightings")
  .get((req, res) => {
    Sightings.getAll().then(sightings => res.send(JSON.stringify(sightings)));
  })
  .post((req, res) => {
    let validKeys = [
      "id",
      "sighting_timestamp",
      "sighting_location",
      "individual_id",
      "is_healthy",
      "sighter_email"
    ];
    let { body } = req;
    let newSightingObj = createValidPropsObj(req.body, validKeys);
    Sightings.createNew(newSightingObj)
      .then(({ data, error }) => {
        if (error) res.status(400).send({ error });
        else res.status(201).send({ data });
      })
      .catch(error => {
        console.error(error);
        res.status(400).send({ error });
      });
  });
// app
//   .route("/api")
//   .get((req, res) => {
//     Things.getAll().then(things => res.send(JSON.stringify(things)));
//   })
//   .post((req, res) => {
//     Things.createNew({ name: "TEST", id: 1 }).then();
//     res.send(JSON.stringify(req.body));
//   });

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, err => {
  console.log(err || `Server listening on port ${PORT}`);
});
