const { z } = require("zod");

exports.RegistrarDocenteAShema = z.object({
    email: z.string({
        required_error: "El correo institucional es obligatorio",
    }).email("Correo electrónico inválido"),
});