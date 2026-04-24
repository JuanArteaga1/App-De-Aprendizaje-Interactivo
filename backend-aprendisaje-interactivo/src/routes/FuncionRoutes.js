const {Router} = require("express");
const {createFuncion,GetFuncionAll,GetFuncionId,PutfuncionId,DeleteFuncionId}=require("../controllers/FuncionControllers")

const router = Router();

router.route("/").get(GetFuncionAll).post(createFuncion);
router.route("/:id").get(GetFuncionId).put(PutfuncionId).delete(DeleteFuncionId);

module.exports =  router;