const {Router} = require("express");
const {createProyectos,GetProyectosAll,GetProyectosId,PutProyectosId,DeleteProyectosId}=require("../controllers/ProyectosControllers")
const {ValidacionSchema} = require('../middlewares/validacionMiddlewares')
const {SubirProyectosSchema} = require("../schemas/ProyectosSchema.js")
const { GuardarImagen, upload } = require("../middlewares/MulterConfig.js");
const { RegistrarDescarga } = require("../controllers/ProyectosControllers");
const { addReview } = require("../controllers/ProyectosControllers");
const { ReviewSchema } = require("../schemas/ReviewSchema");
const { deleteReview } = require("../controllers/ProyectosControllers");

const router = Router();

router.route("/").get(GetProyectosAll).post(upload.fields([{name : "urlArchivoapk",maxCount: 1},{ name: "portada",maxCount: 1},{name:"urlDoc",maxCount: 1 }]),ValidacionSchema(SubirProyectosSchema), createProyectos);
router.route("/:id").get(GetProyectosId).put(upload.fields([{name : "urlArchivoapk",maxCount: 1},{ name: "portada",maxCount: 1},{name:"urlDoc",maxCount: 1 }]),ValidacionSchema(SubirProyectosSchema),PutProyectosId).delete(DeleteProyectosId);
router.post("/:id/descargar", RegistrarDescarga);
router.post("/:id/reviews", ValidacionSchema(ReviewSchema), addReview);
router.delete("/:id/reviews/:reviewId", deleteReview);

module.exports =  router;