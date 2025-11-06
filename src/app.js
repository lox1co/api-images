import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import uploadRoutes from "./routes/upload.js";

const app = express();
app.use(express.json());
app.use(helmet());
app.use(morgan("tiny"));
app.use(cors());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1", uploadRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
});

export default app;
