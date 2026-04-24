import { createContext, useContext, useState } from "react";
import { GetAllInvestigacion, subirInvestigacionAPI, PutInvestigacion, GetIdInvestigacion, DeleteInvestigacion } from "../api/AdmiInvestigacion";
import { notifyApiError, notifySuccess } from "../lib/notify";

const InvestigacionContext = createContext();

export const useInvestigacion = () => {
  const context = useContext(InvestigacionContext);
  if (!context) {
    throw new Error("Debe estar dentro de un provider");
  }
  return context;
};

export const InvestigacionProvider = ({ children }) => {
  const [investigaciones, setInvestigaciones] = useState([]);
  const [errors, setErrors] = useState([]);
  const [mensaje, setMensaje] = useState(null);
  const [traerProyectoId, SettraerProyectoId] = useState(null);



  const ActualizarInvestigaciones = async (Id, data) => {
    try {
      const response = await PutInvestigacion(Id, data);
      setInvestigaciones(response.data);
      notifySuccess("Investigación actualizada", "Los cambios se guardaron correctamente.");
      return { success: true, data: response };
    } catch (error) {
      setMensaje(null);
      setErrors(error.response?.data?.errors || [{ msg: "Error desconocido" }]);
      notifyApiError(error, "Error al actualizar investigación");
      return { success: false, error: error.response?.data?.errors };
    }
  };

  const EliminarInvestigacion = async (id) => {
    try {
      await DeleteInvestigacion(id);
      // Opcional: volver a cargar la lista actualizada
      await traerInvestigaciones();
      notifySuccess("Investigación eliminada", "");
      return { success: true };
    } catch (error) {
      console.log("Error al eliminar el proyecto:", error);
      notifyApiError(error, "Error al eliminar investigación");
      return { success: false, error };
    }
  };

  const traerInvestigaciones = async () => {
    try {
      const response = await GetAllInvestigacion();
      console.log(response.data)
      setInvestigaciones(response.data);
    } catch (error) {
      console.error("Error al traer investigaciones:", error);
      notifyApiError(error, "No se pudieron cargar las investigaciones");
    }
  };

  const sigout = async (data) => {
    try {
      setErrors([]);
      const response = await subirInvestigacionAPI(data);
      setInvestigaciones(response.data);

      if (response.status >= 200 && response.status <= 399) {
        setMensaje("¡Investigación registrada correctamente!");
        setErrors([]);
        notifySuccess("Investigación creada", "Registro guardado correctamente.");
      }
    } catch (error) {
      setMensaje(null);
      setErrors(error.response?.data?.errors || [{ msg: "Error desconocido" }]);
      notifyApiError(error, "Error al crear investigación");
    }
  };

  return (
    <InvestigacionContext.Provider
      value={{
        investigaciones,
        traerInvestigaciones,
        sigout,
        mensaje,
        setMensaje,
        errors,
        setErrors,
        ActualizarInvestigaciones,
        EliminarInvestigacion
      }}
    >
      {children}
    </InvestigacionContext.Provider>
  );
};