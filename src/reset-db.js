const dotenv = require("dotenv");
dotenv.config();

const pool = require("./db.js");

async function resetDatabase() {
  await pool.query(`
    DROP TABLE IF EXISTS files CASCADE;
    DROP TABLE IF EXISTS users CASCADE;
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";

    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      role TEXT DEFAULT 'user',
      subdomain TEXT UNIQUE NOT NULL,
      token UUID UNIQUE DEFAULT gen_random_uuid()
    );

    CREATE TABLE files (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      filename TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log("✅ Base de datos reiniciada.");
  await pool.end();
}

resetDatabase();
