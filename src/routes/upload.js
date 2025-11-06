import express from "express";
import multer from "multer";
import path from "path";
import pool from "../db.js";
import { verifyToken } from "../middleware/auth.js";
import { saveFile } from "../utils/storage.js";

const router = express.Router();
const upload = multer({ dest: "temp/" });

router.post("/upload", verifyToken, upload.single("file"), async (req, res) => {
  const { discord_id, subdomain } = req.user;

  const userRes = await pool.query("SELECT id FROM users WHERE discord_id = $1", [discord_id]);
  const user = userRes.rows[0];
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

  const { slug, path: filePath } = saveFile(req.file, subdomain);

  await pool.query("INSERT INTO files (user_id, name, slug, path) VALUES ($1,$2,$3,$4)", [
    user.id,
    req.file.originalname,
    slug,
    filePath,
  ]);

  const url = `https://${subdomain}.${process.env.DOMAIN}/${slug}`;
  res.json({ url });
});

export default router;
