const ProyectosService = require("../services/ProyectosServices")
const InvestigacionServices = require("../services/InvestigacionServices")
const PodtcasServices = require("../services/PodtcasServices")
const SimulacionesServices = require("../services/SimulacionesServices");


exports.GetProyectosAll = async (req, res) => {
    try {
        const proyectos = await ProyectosService.getAllProyectos(req.body);
        const investigacion = await InvestigacionServices.getAllInvestigacion(req.body);
        const podtcas = await PodtcasServices.getAllPodtcas(req.body);
        const simulaciones = await SimulacionesServices.getAllSimulaciones(req.body);

        // Combinar todo en un objeto (o array, según lo que necesites)
        const resultado = {
            proyectos,
            investigacion,
            podtcas,
            simulaciones
        };
        res.status(200).json(resultado);

    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "error" });
    }
};

exports.GetProyectosId = async (req, res) => {
    try {
        const proyectos = await ProyectosService.getProyectosId(req.params.id)
        const simulaciones = await SimulacionesServices.getSimulacionesId(req.params.id)
        const investigacion = await InvestigacionServices.getInvestigacionId(req.params.id)
        const podtcas = await PodtcasServices.getAllPodtcasId(req.params.id)
        const resultado = {
            proyectos,
            investigacion,
            podtcas,
            simulaciones
        };
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ message: "error" });


    }

}

exports.DeleteProyectos = async (req, res) => {
    try {
        const proyecto = req.body.tipo.proyecto
        const { id } = req.params;
        switch (proyecto) {
            case "Investigación":
                await InvestigacionServices.DeleteInvestigacionId(id);
                return res.status(200).json({ message: "Investigación eliminada con éxito" });
            case "Podcast":
                await PodtcasServices.deletePodtcas(id);
                return res.status(200).json({ message: "Podcast eliminado con éxito" });
            case "Proyecto":
                await ProyectosService.DeleteProyectosId(id);
                return res.status(200).json({ message: "Proyecto eliminado con éxito" });
            case "Simulación":
                await SimulacionesServices.DeleteSimulacionesId(id);
                return res.status(200).json({ message: "Simulación eliminada con éxito" });
            default:
                return res.status(400).json({ error: "Tipo de proyecto no válido" });
        }

    } catch (error) {
        console.error("Error al eliminar proyecto:", error);
        res.status(500).json({ error: "Error del servidor al eliminar proyecto" });
    }
};