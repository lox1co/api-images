const express = require("express");
const path = require("path");
const fs = require("fs");

const router = express.Router();

router.get("/:filename", (req, res) => {
  const subdomain = req.vhost[0]; // loxico
  const filename = req.params.filename; // utp

  const folder = path.join(__dirname, "../..", "uploads", subdomain);
  const files = fs.readdirSync(folder);

  const match = files.find((f) => path.parse(f).name === filename);
  console.log(filename);
  if (!match) return res.status(404).send("Archivo no encontrado");

  const fullPath = path.join(folder, match);
  res.sendFile(path.resolve(fullPath));
});

module.exports = router;
