require("dotenv").config();
const nodemailer = require("nodemailer");
exports.transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USUARIO,
    pass: process.env.EMAIL_PASSWORD,
  },
});
// Solo verificar si se conecta a Gmail
exports.verifyEmail = async (email, token) => {
  try {
    // Verificar la conexión con Gmail
    await exports.transporter.verify();
    console.log("✅ Conexión a Gmail verificada correctamente");
    return true;
  } catch (error) {
    console.error("❌ Error conectando a Gmail:", error);
    return false;
  }
};