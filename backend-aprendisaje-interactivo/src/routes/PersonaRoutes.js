const {Router} = require("express");
const {createPersona,GetPersonaAll,GetPersonaId,DeletePersonaId,PutPersonaId}=require("../controllers/PersonaControllers")

const router = Router();

router.route("/").get(GetPersonaAll).post(createPersona);
router.route("/:id").get(GetPersonaId).put(PutPersonaId).delete(DeletePersonaId);

module.exports =  router;