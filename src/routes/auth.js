const express = require("express");
const jwt = require("jsonwebtoken");
const pool = require("../db.js");
const { getDiscordUser } = require("../services/discord.js");

const router = express.Router();

router.get("/callback", async (req, res) => {
  // const { code } = req.query;
  // if (!code) return res.status(400).json({ error: "Código inválido" });

  // const discordUser = await getDiscordUser(code);
  const discordUser = {
    id: 2,
    discord_id: "89461234567890123445",
    username: "Loxico",
    email: "loxico@example.com",
    subdomain: "loxico",
    avatar: "https://cdn.discordapp.com/avatars/894612345678901234/a_92b67b7df7e9d1a123456789abcd1234.webp",
    created_at: "2025-11-06T22:00:00.000Z",
    iat: 1730948832,
    exp: 1731035232,
  };
  const subdomain = discordUser.username.toLowerCase().replace(/[^a-z0-9]/g, "") + Math.floor(Math.random() * 1000);

  let user = await pool.query("SELECT * FROM users WHERE discord_id = $1", [discordUser.id]);
  if (user.rows.length === 0) {
    user = await pool.query("INSERT INTO users (discord_id, username, subdomain) VALUES ($1,$2,$3) RETURNING *", [
      discordUser.id,
      discordUser.username,
      subdomain,
    ]);
  } else {
    user = user.rows[0];
  }

  const token = jwt.sign({ discord_id: discordUser.id, subdomain: user.subdomain }, process.env.JWT_SECRET);

  await pool.query("UPDATE users SET token = $1 WHERE discord_id = $2", [token, discordUser.id]);

  res.json({ token, subdomain: user.subdomain });
});

module.exports = router;
