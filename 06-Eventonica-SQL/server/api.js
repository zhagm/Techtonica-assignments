const express = require("express");
const router = express.Router();

router.use("/events", require("./routes/events"));
router.use("/users", require("./routes/users"));

module.exports = router;
