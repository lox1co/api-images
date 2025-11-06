const pg = require("pg");
const { Pool } = pg;
console.log(process.env.DATABASE_URL);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;

(async () => {
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS token TEXT;`);
  /*
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      discord_id VARCHAR(255) UNIQUE NOT NULL,
      username VARCHAR(255) NOT NULL,
      subdomain VARCHAR(255) UNIQUE NOT NULL,
      token TEXT,
      avatar_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS uploads (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      filename VARCHAR(255) NOT NULL,
      filepath TEXT NOT NULL,
      mimetype VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log("✅ Tablas verificadas o creadas.");
  */
})();
