const {Router} = require("express");
const {createCategoria,GetCategoriaAll,GetCategoriaId,PutCategoriaId,DeleteCategoriaId}=require("../controllers/CategoriasControllers")
const {ValidacionSchema} = require('../middlewares/validacionMiddlewares')
const {SubirCategoriaSchema} = require("../schemas/CategoriaSchema.js")
const router = Router();

router.route("/").get(GetCategoriaAll).post(ValidacionSchema(SubirCategoriaSchema),createCategoria);
router.route("/:id").get(GetCategoriaId).put(PutCategoriaId).delete(DeleteCategoriaId);

module.exports =  router;