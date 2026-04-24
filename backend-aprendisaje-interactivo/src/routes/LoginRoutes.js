const { Router } = require("express");
const { login, loginout, Profile } = require("../controllers/logincontrollers");
const { AutenticacionRequerida } = require('../middlewares/ValidacionToken')
const { ValidacionSchema } = require('../middlewares/validacionMiddlewares')
const { LoginSchema } = require('../schemas/LoginSchema')
const { verifyToken } = require('../middlewares/ValidacionToken')


const router = Router();
router.route("/").post(ValidacionSchema(LoginSchema), login)
router.route("/out").post(loginout)
router.get("/profile", verifyToken, Profile); // ruta protegida
router.get("/perfil", verifyToken, (req, res) => {
    res.json({ mensaje: "Acceso permitido", usuario: req.user });
});

module.exports = router;