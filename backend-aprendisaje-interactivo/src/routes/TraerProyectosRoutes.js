const {GetProyectosAll,GetProyectosId,DeleteProyectos} = require("../controllers/TraerProyectosControllers")
const {Router} = require("express");

const router = Router();
router.route("/").get(GetProyectosAll)
router.route("/:id").get(GetProyectosId).delete(DeleteProyectos);

module.exports =  router;