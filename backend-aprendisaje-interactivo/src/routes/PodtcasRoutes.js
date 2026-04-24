const {Router} = require("express");
const { getAllPodtcas,getAllPodtcasId,createPodtcas, updatedPodtcasId,deletePodtcas} = require( "../controllers/PodtcasControllers.js"); 
const {ValidacionSchema} = require('../middlewares/validacionMiddlewares')
const {SubirPodcastSchema} = require("../schemas/PodtcasSchema.js")
const { GuardarImagen, upload } = require("../middlewares/MulterConfig.js");



const router = Router();


router.route("/").get(getAllPodtcas).post(upload.fields([{name:"portada",maxCount:1}]),ValidacionSchema(SubirPodcastSchema),createPodtcas);;
router.route("/:id").get(getAllPodtcasId).put(upload.fields([{name:"portada",maxCount:1}]),ValidacionSchema(SubirPodcastSchema),updatedPodtcasId).delete(deletePodtcas);

module.exports =  router;