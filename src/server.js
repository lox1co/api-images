import app from "./app.js";
import pool from "./db.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await pool.connect();
    app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
  } catch (err) {
    console.error("Error al iniciar servidor:", err);
  }
})();
