const pgp = require("pg-promise")();

const dbConfig = {
  host: "localhost",
  port: 5432,
  database: "eventonica",
  user: "zhag",
  password: "password"
};

const db = pgp(dbConfig);

module.exports = db;
