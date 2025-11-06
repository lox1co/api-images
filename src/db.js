const pg = require("pg");
const { Pool } = pg;
console.log(process.env.DATABASE_URL);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;
