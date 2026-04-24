const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RolSchema = new Schema({
    tipo_Rol: {
        type: String,
        required: true
    }
    
});

module.exports = mongoose.model("Rol",RolSchema)