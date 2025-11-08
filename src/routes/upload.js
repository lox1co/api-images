const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pool = require("../db.js");
const { auth } = require("../middleware/auth.js");

const router = express.Router();

const uploadDir = process.env.UPLOAD_DIR || "uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userDir = path.join(uploadDir, req.user.subdomain);
    if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + path.extname(file.originalname);
    cb(null, filename);
  },
});
const upload = multer({ storage });

router.post("/", auth(), upload.single("file"), async (req, res) => {
  try {
    const { filename } = req.file;

    await pool.query(`INSERT INTO files (user_id, filename) VALUES ($1, $2)`, [req.user.id, filename]);

    const fileUrl = `https://${req.user.subdomain}.${process.env.DOMAIN}/${path.parse(filename).name}`;
    res.json({ url: fileUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al subir archivo" });
  }
});

module.exports = router;
