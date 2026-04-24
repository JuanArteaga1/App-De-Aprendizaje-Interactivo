const jwt = require("jsonwebtoken")
require('dotenv').config();
const JWT_SECRET = process.env.TOKEN_SECRETA

if (!JWT_SECRET) {
  console.warn("⚠️ WARNING: JWT_SECRET no está definido en las variables de entorno");
}


exports.verifyToken = (req, res, next) => {
  const token = req.cookies?.token; // nombre: 'token'
  if (!token) return res.status(401).json({ error: "Acceso no autorizado" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // attach user payload to req.user (estándar)
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};

// alias si quieres mantener nombre anterior
exports.AutenticacionRequerida = exports.verifyToken;