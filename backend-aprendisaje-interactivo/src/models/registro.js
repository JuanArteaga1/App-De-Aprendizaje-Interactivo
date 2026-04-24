const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  is_verified: {
    type: Boolean,
    default: false
  },
  is_first_login: {
    type: Boolean,
    default: true
  },
  activation_token: {
    type: String,   // aquí guardas el token generado
    required: true
  },
  activation_expires: {
    type: Date,     // fecha límite para usar el token
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);