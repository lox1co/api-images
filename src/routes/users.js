const express = require("express");
const pool = require("../db.js");
const { v4: uuidv4 } = require("uuid");
const { auth } = require("../middleware/auth.js");

const router = express.Router();

router.post("/", auth("owner"), async (req, res) => {
  try {
    const { username, email, role } = req.body;
    if (!username || !email) return res.status(400).json({ error: "Faltan datos" });

    const subdomain = username.toLowerCase().replace(/\s+/g, "-");
    const token = uuidv4();

    const { rows } = await pool.query(
      `INSERT INTO users (username, email, role, subdomain, token)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, username, email, role, subdomain, token`,
      [username, email, role || "user", subdomain, token]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear usuario" });
  }
});

router.get("/", auth("admin"), async (req, res) => {
  const { rows } = await pool.query("SELECT id, username, email, role, subdomain FROM users");
  res.json(rows);
});

router.delete("/:id", auth("owner"), async (req, res) => {
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [req.params.id]);
    res.json({ message: "Usuario eliminado" });
  } catch {
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
});

module.exports = router;
