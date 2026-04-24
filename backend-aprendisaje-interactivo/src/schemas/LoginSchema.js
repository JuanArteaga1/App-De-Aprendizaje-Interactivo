const z = require('zod')


exports.LoginSchema = z.object({
    email: z.string({
        required_error:"CORREO INCORRECTO"
    }).email({
        required_error:"Email invalido"
    }),
    contrasena: z.string({
        required_error:"CONTRASEÑA INCORRECTA"
    })

})