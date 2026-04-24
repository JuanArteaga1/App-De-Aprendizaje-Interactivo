const {Router} = require("express");
const {createMateria, GetMateriaAll, getMateriaId, PutMateriaId, DeleteMateriaId} = require('../controllers/MateriaControllers');

const router = Router();

router.route("/").get(GetMateriaAll).post(createMateria);
router.route("/:id").get(getMateriaId).put(PutMateriaId).delete(DeleteMateriaId);

module.exports =  router;