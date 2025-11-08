const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const usersRouter = require("./routes/users.js");
const uploadRouter = require("./routes/upload.js");
const serve = require("./routes/serve.js");
const vhost = require("vhost");

const app = express();
const fs = require("fs");
app.use(express.json());
app.use(helmet());
app.use(morgan("tiny"));
app.use(cors());

app.use("/api/v1/users", usersRouter);
app.use("/api/v1/upload", uploadRouter);
app.use(vhost(`*.localhost`, serve));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
});

module.exports = app;
