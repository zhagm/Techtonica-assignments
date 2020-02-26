const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const PORT = 3000;

// Middleware
// app.use(express.static(__dirname + "/public"));
app.use(bodyParser());

app.get("/", (req, res) => {
  res.sendFile(__dirname + `/index.html`);
});

let people = ["Robyn", "Quincy", "Zarina", "Cadence", "Gabby", "Ariel", "Zhag"];

app
  .route("/people")
  .get((req, res) => {
    res.status(200).send(people);
  })
  .post((req, res) => {
    let newPerson = req.body.name;
    people.push(newPerson);
    res
      .status(200)
      .send(
        `new person is ${people[people.length - 1]} at index ${people.length -
          1}!`
      );
  });

app
  .route("/people/:id")
  .get((req, res) => {
    let index = req.params.id;
    if (!people[index]) res.status(400).send("ERROR: Person does not exist!");
    res.status(200).send(`${people[index]}`);
  })
  .put((req, res) => {
    let newName = req.body.name;
    let id = req.params.id;
    people[id] = newName;
    res.status(200).send(`updated person is ${people[id]}!`);
  })
  .delete((req, res) => {
    let id = req.params.id;
    if (id > people.length - 1)
      res.status(400).send("ERROR: Person does not exist.");
    people.splice(id, 1);
    res.status(200).send(`FTP!`);
  });

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
