const { Pool } = require("pg");

const dbPool = new Pool({
  user: "postgres",
  database: "personal_web",
  password: "root",
  port: "5432",
});

module.exports = dbPool;
