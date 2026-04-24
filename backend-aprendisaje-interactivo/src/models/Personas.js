const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PersonaSchema = new Schema({
    UsuarioId: {
        type: Schema.Types.ObjectId, 
        required: true,
        ref: 'Usuarios'
    },
    NombreCompleto: {
        type: String,
        required: true
    },
    NumeroIdentificacion: {
        type: String,
        required: true
    },
    
});

module.exports = mongoose.model("Persona",PersonaSchema)