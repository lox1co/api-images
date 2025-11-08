const pool = require("../db.js");
function auth(requiredRole = null) {
  return async (req, res, next) => {
    try {
      const header = req.headers.authorization;
      if (!header?.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token requerido" });
      }

      const token = header.split(" ")[1];
      const { rows } = await pool.query("SELECT * FROM users WHERE token = $1", [token]);

      if (!rows.length) return res.status(401).json({ error: "Token inválido" });

      const user = rows[0];
      req.user = user;

      if (requiredRole && user.role !== requiredRole && user.role !== "owner") {
        return res.status(403).json({ error: "Permisos insuficientes" });
      }

      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al validar token" });
    }
  };
}

module.exports = { auth };
