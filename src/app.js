const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const authRoutes = require("./routes/auth.js");
const uploadRoutes = require("./routes/upload.js");
const vhost = require("vhost");
const path = require("path");
const app = express();
const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, "../uploads");
app.use(express.json());
app.use(helmet());
app.use(morgan("tiny"));
app.use(cors());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1", uploadRoutes);
app.use(
  vhost(`*.${process.env.DOMAIN}`, (req, res) => {
    const subdomain = req.vhost[0]; // el nombre del subdominio
    const urlPath = req.url.replace(/^\//, ""); // quita la barra inicial
    const filePath = path.join(uploadDir, subdomain, urlPath);

    res.sendFile(filePath, (err) => {
      if (err) {
        res.status(404).send("Archivo no encontrado");
      }
    });
  })
);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
});

module.exports = app;
