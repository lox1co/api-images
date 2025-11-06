import express from "express";
import jwt from "jsonwebtoken";
import pool from "../db.js";
import { getDiscordUser } from "../services/discord.js";

const router = express.Router();

router.get("/callback", async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).json({ error: "Código inválido" });

  const discordUser = await getDiscordUser(code);

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

  const token = jwt.sign({ discord_id: discordUser.id, subdomain: user.subdomain }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  await pool.query("UPDATE users SET token = $1 WHERE discord_id = $2", [token, discordUser.id]);

  res.json({ token, subdomain: user.subdomain });
});

export default router;
