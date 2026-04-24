require('dotenv').config();
const Token_Secreta = process.env.Token_Secreta;
const jwt = require("jsonwebtoken");

exports.CreateToken = async (payload) => {
    return new Promise((resolve, reject) => {
        jwt.sign(
            { payload }, // lo que vas a guardar dentro del token
            Token_Secreta,
            { expiresIn: "1d" }, // duración del token
            (err, token) => {
                if (err) reject(err);
                resolve(token);
            }
        );
    });
};

// Verificar token
exports.VerifyToken = async (req, res) => {
    // Si el token viene como parámetro en la URL
    const token = req.params.token;
    console.log("Token recibido:", token);
    
    if (!token) {
        res.status(403).json({ message: "No hay token, acceso denegado" });
        return null;
    }
    
    try {
        const decoded = jwt.verify(token, Token_Secreta);
        console.log("Token decodificado completo:", decoded);
        
        return decoded.payload || decoded;
    } catch (err) {
        console.error("Error al verificar token:", err.message);
        res.status(401).json({ message: "Token inválido o expirado" });
        return null;
    }
};


