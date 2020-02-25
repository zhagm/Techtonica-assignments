const express = require("express");
const router = express.Router();

router.use("/events", require("./events"));
// router.use("/users", require("./users"));

module.exports = router;
