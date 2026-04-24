const mongoose = require( "mongoose");
require('dotenv').config();

exports.connectdb = async () => {
    try {
        await mongoose.connect(process.env.BASE_DE_DATOS)
        console.log('BASE DE DATOS CONECTADA')
        
    } catch (error) {
        console.log(error)
    }
}