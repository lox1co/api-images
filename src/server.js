const dotenv = require("dotenv");
dotenv.config();

const app = require("./app.js");
const pool = require("./db.js");
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await pool.connect();
    app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
  } catch (err) {
    console.error("Error al iniciar servidor:", err);
  }
})();
