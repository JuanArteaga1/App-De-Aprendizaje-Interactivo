const {Router} = require("express");
const { createInvestigacion, GetInvestigacionAll, GetInvestigacionId, PutInvestigacionId, DeleteInvestigacionId } = require("../controllers/InvestigacionControllers");
const {ValidacionSchema} = require('../middlewares/validacionMiddlewares')
const {SubirInvestigacionSchema} = require("../schemas/InvestigacionesSchema.js")
const { GuardarImagen, upload } = require("../middlewares/MulterConfig.js");
;

const router = Router();

router.route("/").get(GetInvestigacionAll).post(upload.fields([{ name: "portada",maxCount: 1},{name:"urlDoc",maxCount: 1 }]),ValidacionSchema(SubirInvestigacionSchema),createInvestigacion);
router.route("/:id").get(GetInvestigacionId).put(upload.fields([{ name: "portada",maxCount: 1},{name:"urlDoc",maxCount: 1 }]),ValidacionSchema(SubirInvestigacionSchema),PutInvestigacionId).delete(DeleteInvestigacionId);

module.exports =  router;