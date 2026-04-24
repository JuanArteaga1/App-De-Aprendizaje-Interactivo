const {Router} = require("express");
const {createRol,GetRolAll,GetRolId,PutRolId,DeleteRolId}=require("../controllers/RolControllers")

const router = Router();

router.route("/").get(GetRolAll).post(createRol);
router.route("/:id").get(GetRolId).put(PutRolId).delete(DeleteRolId);

module.exports =  router;