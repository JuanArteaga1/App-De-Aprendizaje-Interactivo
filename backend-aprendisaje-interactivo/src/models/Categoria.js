const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategoriaSchema = new Schema({
    Nombre_Categoria: {
        type: String,
        required: true
    },
    Descripcion: {
        type: String,
        required: true
    },
    
});

module.exports = mongoose.model("Categoria",CategoriaSchema)