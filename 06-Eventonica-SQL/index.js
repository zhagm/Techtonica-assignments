const PORT = process.env.PORT || 3000;

/* REQUIRES */
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const morgan = require("morgan");

/* APP DECLARATION */
const app = express();
const router = express.Router();

/* MIDDLEWARE */
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname + "/public")));
app.use(morgan("tiny"));

/* CUSTOM MIDDLEWARE TO EXTEND res */
app.use(function(req, res, next) {
  res.handle = ({ data, error }) => {
    if (error) res.status(400).send(`ERROR: ${error}`);
    else res.status(200).send(data);
  };
  next();
});

/* ROUTES */
app.use("/api", require("./server/api"));

/* SERVER LISTENING */
app.listen(PORT, err => {
  console.log(err || `Server listening on port ${PORT}`);
});
