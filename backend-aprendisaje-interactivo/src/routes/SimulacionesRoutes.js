const {Router} = require("express");
const {createSimulaciones, GetSimulacionesAll, getSimulacionesId, PutSimulacionesId, DeleteSimulacionesId} = require('../controllers/SimulacionesControllers');
const {ValidacionSchema} = require('../middlewares/validacionMiddlewares')
const {SubirSimulacionesSchema} = require("../schemas/SimulacionesSchema.js")

const {GuardarImagen, upload } = require("../middlewares/MulterConfig.js");

const router = Router();
const { RegistrarDescarga } = require("../controllers/SimulacionesControllers");

const { addReview } = require("../controllers/SimulacionesControllers");
const { ReviewSchema } = require("../schemas/ReviewSchema");
const { deleteReview } = require("../controllers/SimulacionesControllers");

router.route("/").get(GetSimulacionesAll).post(upload.fields([{name:"urlArchivoapk",maxCount:1},{name:"urlDoc",maxCount:1},{name:"portada",maxCount:1}]), ValidacionSchema(SubirSimulacionesSchema),createSimulaciones);
router.route("/:id").get(getSimulacionesId).put(upload.fields([{name:"urlArchivoapk",maxCount:1},{name:"urlDoc",maxCount:1},{name:"portada",maxCount:1}]), ValidacionSchema(SubirSimulacionesSchema),PutSimulacionesId).delete(DeleteSimulacionesId);
router.post("/:id/descargar", RegistrarDescarga);
router.post("/:id/reviews", ValidacionSchema(ReviewSchema), addReview);
router.delete("/:id/reviews/:reviewId", deleteReview);

module.exports =  router;