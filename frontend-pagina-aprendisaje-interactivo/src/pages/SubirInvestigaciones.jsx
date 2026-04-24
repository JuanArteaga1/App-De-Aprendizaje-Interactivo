import React, { useEffect, useState } from "react";
import MenuLateral from "../components/MenuAdmi_Doc";
import { useForm, useFieldArray } from "react-hook-form";
import Alerta from "../components/AlertasDocente";
import { useLogin } from "../context/LoginContext";
import { ImageIcon, UploadIcon, FileText, Sliders, UploadCloud, ArrowRight, ArrowLeft } from "lucide-react";
import { useInvestigacion } from "../context/InvestigacionContext";
import { GetAllMateria } from "../api/AdmiMateria";


const SubirInvestigaciones = () => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    trigger,
  } = useForm({
    defaultValues: {
      autores: [{ nombre: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "autores" });

  const { sigout, errors: InvestigacionErrors, mensaje, setMensaje, setErrors } = useInvestigacion();
  const { Usuario } = useLogin();
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const [pasoActual, setPasoActual] = useState(1);
  const [materias, setMaterias] = useState([]);
  const MAX_SIZE = 10 * 1024 * 1024;
  const portada = watch("portada");
  const urlDoc = watch("urlDoc");

  const pasosInfo = [
    { id: 1, titulo: "Información General", icono: <FileText className="w-5 h-5 mr-2" /> },
    { id: 2, titulo: "Detalles", icono: <Sliders className="w-5 h-5 mr-2" /> },
    { id: 3, titulo: "Archivos", icono: <UploadCloud className="w-5 h-5 mr-2" /> },
  ];

  // Validación por pasos
  const camposPaso1 = ["nombre_proyecto", "descripcion", "autores", "fechaPublicacion"];
  const camposPaso2 = ["materia", "UrlArticulo", "UrlDoi"];
  const camposPaso3 = ["portada", "urlDoc"];

  const siguientePaso = async () => {
    let camposAValidar = [];
    if (pasoActual === 1) camposAValidar = camposPaso1;
    if (pasoActual === 2) camposAValidar = camposPaso2;

    const valido = await trigger(camposAValidar);
    if (valido && pasoActual < pasosInfo.length) setPasoActual(pasoActual + 1);
  };
  const cargarMaterias = async () => {
      try {
        const res = await GetAllMateria();
        setMaterias(res.data);
      } catch (error) {
        console.error("Error cargando materias", error);
      }
    };

  const pasoAnterior = () => {
    if (pasoActual > 1) setPasoActual(pasoActual - 1);
  };

  useEffect(() => {
    if (mensaje) {
      setRegistroExitoso(true);
      const timer = setTimeout(() => {
        setRegistroExitoso(false);
        setMensaje(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [mensaje, setMensaje]);

  useEffect(() => {
    if (InvestigacionErrors.length > 0) {
      const timer = setTimeout(() => setErrors([]), 8000);
      return () => clearTimeout(timer);
    }
  }, [InvestigacionErrors, setErrors]);
  useEffect(() => {
      cargarMaterias();
    }, []);
  

  return (
    <div className="flex h-screen bg-gray-100">
      {mensaje && (
        <div className="fixed top-5 right-5 z-50">
          <Alerta tipo="exito" mensaje={mensaje} onClose={() => setMensaje(null)} />
        </div>
      )}

      {InvestigacionErrors.length > 0 && (
        <div className="fixed top-20 right-5 z-50 space-y-2">
          {InvestigacionErrors.map((error, i) => (
            <Alerta key={i} tipo="error" mensaje={error.msg} />
          ))}
        </div>
      )}

      <MenuLateral rol="docente" />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Indicador de pasos */}
          <div className="mb-12">
            <div className="flex justify-between items-center relative w-full">
              {/* Línea divisoria siempre horizontal */}
              <div className="absolute left-0 right-0 h-1 bg-gray-300 z-0 top-1/3 mx-6"></div>

              {pasosInfo.map((paso) => (
                <React.Fragment key={paso.id}>
                  <div className="flex flex-col items-center relative z-10 flex-1">
                    <span
                      className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full text-white transition-colors duration-300 
                  ${pasoActual === paso.id ? "bg-blue-600 shadow-md" : "bg-gray-400"}`}
                    >
                      {React.cloneElement(paso.icono, { className: "w-5 h-5 sm:w-6 sm:h-6" })}
                    </span>
                    <div
                      className={`text-center mt-2 text-xs sm:text-sm whitespace-nowrap 
                  ${pasoActual === paso.id ? "text-blue-600 font-semibold" : "text-gray-600"}`}
                    >
                      {paso.titulo}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Formulario */}
          <form
            onSubmit={handleSubmit(async (data) => {
              const formData = new FormData();
              formData.append("nombre_proyecto", data.nombre_proyecto);
              formData.append("descripcion", data.descripcion);
              formData.append("autores", data.autores.map((a) => a.nombre).join(", "));
              formData.append("fechaPublicacion", data.fechaPublicacion);
              formData.append("materia", data.materia);
              formData.append("urlArticulo", data.UrlArticulo);
              formData.append("urlDoi", data.UrlDoi);
              if (data.portada?.[0]) formData.append("portada", data.portada[0]);
              if (data.urlDoc?.[0]) formData.append("urlDoc", data.urlDoc[0]);
              formData.append("Usuario", Usuario?.id || "");
              formData.append("seccion", "Investigacion");
              await sigout(formData);
            })}
            className="space-y-6 bg-white p-8 rounded-2xl shadow-xl"
          >
            {pasoActual === 1 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-700">Paso 1: Información General</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

                  {/* Columna izquierda */}
                  <div className="space-y-6">
                    {/* Título */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Título</label>
                      <input
                        {...register("nombre_proyecto", { required: true })}
                        type="text"
                        placeholder="Ejemplo: Investigación sobre energías renovables"
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                      {errors.nombre_proyecto && (
                        <p className="mt-1 text-red-500 text-sm">El título es obligatorio</p>
                      )}
                    </div>

                    {/* Descripción */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Descripción</label>
                      <textarea
                        {...register("descripcion", { required: true })}
                        rows="4"
                        placeholder="Una breve descripción de la investigación"
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                      {errors.descripcion && (
                        <p className="mt-1 text-red-500 text-sm">La descripción es obligatoria</p>
                      )}
                    </div>
                  </div>

                  {/* Columna derecha */}
                  <div className="space-y-6">
                    {/* Autores */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Autores</label>
                      {fields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-2 mb-2">
                          <input
                            {...register(`autores.${index}.nombre`, { required: true })}
                            type="text"
                            placeholder={`Autor ${index + 1}`}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                          {fields.length > 1 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="text-gray-500 hover:text-red-600 transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2">
                                <path d="M3 6h18" />
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                <line x1="10" x2="10" y1="11" y2="17" />
                                <line x1="14" x2="14" y1="11" y2="17" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => append({ nombre: "" })}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus mr-1">
                          <path d="M5 12h14" />
                          <path d="M12 5v14" />
                        </svg>
                        Añadir autor
                      </button>
                      {errors.autores && (
                        <p className="mt-1 text-red-500 text-sm">Se requiere al menos un autor</p>
                      )}
                    </div>

                    {/* Fecha */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Fecha de Publicación</label>
                      <input
                        type="datetime-local"
                        {...register("fechaPublicacion", { required: true })}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                      {errors.fechaPublicacion && (
                        <p className="mt-1 text-red-500 text-sm">La fecha es requerida</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Paso 2 */}
            {pasoActual === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-700">Paso 2: Detalles Adicionales</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Materia</label>
                    <select
                      {...register('materia', { required: true })}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Seleccionar materia</option>
                      {materias.map((materia) => (
                        <option key={materia._id || materia.id} value={materia.nombre}>
                          {materia.nombre}
                        </option>
                      ))}
                    </select>
                    {errors.materia && (<p className="mt-1 text-red-500 text-sm">Materia es requerida</p>)}
                  </div>

                <div>
                  <label className="block font-semibold text-gray-800">URL del Artículo</label>
                  <input
                    type="url"
                    {...register("UrlArticulo", { required: "Debe ingresar el enlace del artículo" })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg"
                  />
                  {errors.UrlArticulo && <p className="text-red-500 text-sm">{errors.UrlArticulo.message}</p>}
                </div>

                <div>
                  <label className="block font-semibold text-gray-800">URL DOI</label>
                  <input
                    type="url"
                    {...register("UrlDoi", { required: "Debe ingresar la URL del DOI" })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg"
                  />
                  {errors.UrlDoi && <p className="text-red-500 text-sm">{errors.UrlDoi.message}</p>}
                </div>
              </div>
            )}

            {/* Paso 3 */}
            {pasoActual === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-700">Paso 3: Cargar Archivos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Imagen de portada */}
                  <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      {...register("portada", { required: "Se requiere una imagen" })}
                    />
                    {portada?.[0] ? (
                      <span className="text-center text-sm text-gray-700 mt-1 break-words w-full px-2">
                        {portada[0].name}
                      </span>
                    ) : (
                      <>
                        <ImageIcon className="w-10 h-10 text-black opacity-50" />
                        <span className="text-sm text-gray-600 mt-1">Imagen de la portada</span>
                      </>
                    )}
                    {errors.portada && (
                      <p className="mt-1 text-red-500 text-sm text-center">{errors.portada.message}</p>
                    )}
                  </label>

                  {/* Documento PDF */}
                  <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      {...register("urlDoc", { required: "Se requiere un documento" })}
                    />
                    {urlDoc?.[0] ? (
                      <span className="text-center text-sm text-gray-700 mt-1 break-words w-full px-2">
                        {urlDoc[0].name}
                      </span>
                    ) : (
                      <>
                        <UploadIcon className="w-10 h-10 text-black opacity-50" />
                        <span className="text-sm text-gray-600 mt-1">Documento PDF</span>
                      </>
                    )}
                    {errors.urlDoc && (
                      <p className="mt-1 text-red-500 text-sm text-center">{errors.urlDoc.message}</p>
                    )}
                  </label>
                </div>
              </div>
            )}

            {/* Botones de navegación */}
            <div className="flex justify-between pt-4">
              {pasoActual > 1 && (
                <button type="button" onClick={pasoAnterior} className="w-40 flex items-center justify-center bg-gray-300 text-gray-800 py-2 px-4 rounded-xl font-semibold hover:bg-gray-400">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Anterior
                </button>
              )}
              {pasoActual < pasosInfo.length && (
                <button type="button" onClick={siguientePaso} className="w-40 ml-auto flex items-center justify-center bg-indigo-600 text-white py-2 px-4 rounded-xl font-semibold hover:bg-indigo-700">
                  Siguiente <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              )}
              {pasoActual === pasosInfo.length && (
                <button type="submit" className="w-50 bg-gradient-to-br from-indigo-600 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700">
                  Subir investigación
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default SubirInvestigaciones;

