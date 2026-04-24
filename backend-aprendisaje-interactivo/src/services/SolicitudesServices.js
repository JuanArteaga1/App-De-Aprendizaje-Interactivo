const UserModel = require('../models/registro');

// Eliminar solicitud por ID
exports.DeleteSolicitudesId = async (id) => {
    const UserDelete = await UserModel.findByIdAndDelete(id);
    return UserDelete;
};

// Obtener todas las solicitudes con datos filtrados
exports.getAllSolicitudes = async () => {
    const users = await UserModel.find();

    // Filtrar y transformar la respuesta
    return users.map(user => {
        if (!user.is_verified) {
            // Usuario nuevo → verificar si ya expiró
            const expirado = user.activation_expires && user.activation_expires < Date.now();

            return {
                id: user._id,
                email: user.email,
                createdAt: user.createdAt,
                activation_expires: expirado ? "Expirado" : user.activation_expires
            };
        } else {
            // Usuario ya registrado → incluir email y fecha creación
            return {
                id: user._id,
                email: user.email,
                createdAt: user.createdAt,
                activation_expires: "Cuenta ya activada"
            };
        }
    });
};