import React, { useEffect, useState } from "react";
import MenuLateral from "../components/MenuAdmi_Doc";
import { useForm, useFieldArray } from "react-hook-form";
import { usePodcast } from "../context/PodcastContext";
import { UseCategoria } from "../context/CategoriaContext"
import Alerta from "../components/AlertasDocente";
import { useLogin } from "../context/LoginContext"
import { ImageIcon, FileText, Sliders, UploadCloud, ArrowRight, ArrowLeft } from 'lucide-react';
import { GetAllMateria } from "../api/AdmiMateria";


function SubirPodcast() {
  const { register, handleSubmit, watch, formState: { errors }, control, trigger } = useForm({
    defaultValues: {
      autores: [{ nombre: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "autores" });

  const { sigout, errors: PodcastErros, mensaje, setMensaje, setErrors } = usePodcast();
  const portadaPreview = watch("portada")?.[0];
  const { TraerCategoria, Categoria } = UseCategoria();
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const { Usuario } = useLogin();
  const portada = watch('portada');
  const MAX_SIZE = 10 * 1024 * 1024;
  const [materias, setMaterias] = useState([]);

  // NUEVO: Estado y configuración de los pasos
  const [pasoActual, setPasoActual] = useState(1);
  const pasosInfo = [
    { id: 1, titulo: 'Información General', icono: <FileText className="w-5 h-5" /> },
    { id: 2, titulo: 'Detalles', icono: <Sliders className="w-5 h-5" /> },
    { id: 3, titulo: 'Archivos', icono: <UploadCloud className="w-5 h-5" /> },
  ];

  // NUEVO: Funciones de navegación
  const camposPaso1 = ["nombre_proyecto", "descripcion", "autores", "fecha"];
  const camposPaso2 = ["audioLink", "categoriaId", "materia"];
  const camposPaso3 = ["portada"];

  const siguientePaso = async () => {
    let camposAValidar = [];
    if (pasoActual === 1) camposAValidar = camposPaso1;
    if (pasoActual === 2) camposAValidar = camposPaso2;

    const esValido = await trigger(camposAValidar);
    if (esValido && pasoActual < pasosInfo.length) {
      setPasoActual(pasoActual + 1);
    }
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
    if (pasoActual > 1) {
      setPasoActual(pasoActual - 1);
    }
  };

  useEffect(() => {
    TraerCategoria();
    cargarMaterias();
  }, []);

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => {
        setRegistroExitoso(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  useEffect(() => {
    if (PodcastErros.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [PodcastErros]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("nombre_proyecto", data.nombre_proyecto);
    formData.append("descripcion", data.descripcion);
    const autoresFormateados = data.autores.map(a => a.nombre).join(", ");
    formData.append("autores", autoresFormateados);
    formData.append("fechaPublicacion", data.fecha);
    formData.append("materia", data.materia);
    formData.append("UrlAudio", data.audioLink);
    formData.append("portada", data.portada[0]);
    formData.append("Usuario", Usuario.id);
    formData.append("seccion", "Podcast");
    formData.append("categoriaId", data.categoriaId);

    const respuesta = await sigout(formData);
    if (respuesta?.success) {
      setRegistroExitoso(true);
    }

    console.log("Enviando podcast:", Object.fromEntries(formData));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {mensaje && (
        <div className="fixed top-5 right-5 z-50">
          <Alerta tipo="exito" mensaje={mensaje} onClose={() => setMensaje(null)} />
        </div>
      )}

      {PodcastErros.length > 0 && (
        <div className="fixed top-20 right-5 z-50 space-y-2">
          {PodcastErros.map((error, i) => (
            <Alerta key={i} tipo="error" mensaje={error.msg} />
          ))}
        </div>
      )}

      <div>
        <MenuLateral rol="docente" />
      </div>

      <div className="w-full">
        <div className="p-4 md:p-8 md:pl-16">
          <div className="w-full md:max-w-2xl mx-auto">

            {/* Indicador de pasos */}
            <div className="mb-12">
              <div className="flex justify-between items-center relative w-full">
                {/* Línea divisoria horizontal */}
                <div className="absolute left-0 right-0 h-1 bg-gray-300 z-0 top-1/3 mx-6"></div>

                {pasosInfo.map((paso) => (
                  <div
                    key={paso.id}
                    className="flex flex-col items-center relative z-10 flex-1"
                  >
                    <span
                      className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full text-white transition-colors duration-300
          ${pasoActual === paso.id ? 'bg-blue-600 shadow-md' : 'bg-gray-400'}`}
                    >
                      {React.cloneElement(paso.icono, { className: "w-5 h-5 sm:w-6 sm:h-6" })}
                    </span>
                    <div
                      className={`text-center mt-2 text-xs sm:text-sm whitespace-nowrap
          ${pasoActual === paso.id ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}
                    >
                      {paso.titulo}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Formulario */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100"
            >
              {/* Contenido del Paso 1 */}
              {pasoActual === 1 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-700">Paso 1: Información General</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

                    {/* Título */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Título del Podcast</label>
                      <input
                        type="text"
                        {...register("nombre_proyecto", { required: true })}
                        placeholder="Ej: La revolución de la IA"
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm 
                     focus:ring-blue-500 focus:border-blue-500"
                      />
                      {errors.nombre_proyecto && (
                        <p className="mt-1 text-red-500 text-sm">El título es requerido</p>
                      )}
                    </div>

                    {/* Descripción */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Descripción</label>
                      <textarea
                        {...register("descripcion", { required: true })}
                        rows="4"
                        placeholder="Describe el contenido de tu podcast..."
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm 
                     focus:ring-blue-500 focus:border-blue-500"
                      />
                      {errors.descripcion && (
                        <p className="mt-1 text-red-500 text-sm">La descripción es requerida</p>
                      )}
                    </div>

                    {/* Autores */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Autores</label>
                      {fields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-2 mb-2">
                          <input
                            type="text"
                            {...register(`autores.${index}.nombre`, { required: "El nombre del autor es obligatorio" })}
                            placeholder={`Autor #${index + 1}`}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm 
                         focus:ring-blue-500 focus:border-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-gray-500 hover:text-red-600 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                              strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2">
                              <path d="M3 6h18" />
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                              <line x1="10" x2="10" y1="11" y2="17" />
                              <line x1="14" x2="14" y1="11" y2="17" />
                            </svg>
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => append({ nombre: "" })}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                          strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus mr-1">
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
                        {...register("fecha", { required: true })}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm 
                     focus:ring-blue-500 focus:border-blue-500"
                      />
                      {errors.fecha && (
                        <p className="mt-1 text-red-500 text-sm">La fecha es requerida</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Contenido del Paso 2 */}
              {pasoActual === 2 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-700">Paso 2: Detalles</h3>

                  {/* Link del Audio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Link del Audio</label>
                    <input
                      type="url"
                      {...register("audioLink", { required: true })}
                      placeholder="https://ejemplo.com/audio.mp3"
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm 
                   focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.audioLink && (
                      <p className="mt-1 text-red-500 text-sm">El link del audio es requerido</p>
                    )}
                  </div>

                  {/* Materia y Categoría lado a lado */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Categoría</label>
                      <select
                        {...register("categoriaId", { required: true })}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm 
                     focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Seleccionar categoría</option>
                        {Categoria && Categoria.map((categoria) => (
                          <option key={categoria.id} value={categoria.id}>
                            {categoria.Nombre_Categoria}
                          </option>
                        ))}
                      </select>
                      {errors.categoriaId && (
                        <p className="mt-1 text-red-500 text-sm">La categoría es requerida</p>
                      )}
                    </div>

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
                  </div>
                </div>
              )}

              {/* Contenido del Paso 3 */}
              {pasoActual === 3 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-700">Paso 3: Cargar Archivos</h3>
                  <div className="space-y-2">
                    <label className="block text-base font-semibold text-gray-800">Subir Portada</label>
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-6 cursor-pointer hover:border-indigo-500 bg-gray-50 hover:bg-indigo-50 transition-colors group">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        {...register("portada", {
                          required: "La imagen es obligatoria",
                          validate: {
                            tamaño: (archivos) =>
                              archivos[0]?.size <= MAX_SIZE || 'La imagen supera los 10MB',
                            tipo: (archivos) =>
                              /\.(jpg|jpeg|png|webp)$/i.test(archivos?.[0]?.name || '') || 'El archivo debe ser una imagen válida (.jpg, .jpeg, .png, .webp)',
                          },
                        })}
                      />
                      {portada?.[0] && <span className="text-sm text-gray-700 mt-1">{portada[0].name}</span>}
                      {portada?.length > 0 && !errors.portada && (
                        <p className="text-green-500 text-center font-semibold text-sm">Imagen subida correctamente</p>
                      )}
                      {errors.portada && (
                        <p className="text-red-500 font-semibold text-sm">{errors.portada.message}</p>
                      )}
                      {!portada?.[0] && <ImageIcon className="w-10 h-10 text-black opacity-50" />}
                      {!portada?.[0] && <span className="text-sm">Imagen de la portada</span>}
                    </label>
                  </div>

                  {portadaPreview && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">Vista previa de la portada:</h4>
                      <img
                        src={URL.createObjectURL(portadaPreview)}
                        alt="Portada"
                        className="max-w-xs rounded-xl shadow-md border-2 border-gray-100"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Botones de navegación */}
              <div className="flex justify-between pt-4">
                {pasoActual > 1 && (
                  <button
                    type="button"
                    onClick={pasoAnterior}
                    className="w-40 flex items-center justify-center bg-gray-300 text-gray-800 py-2 px-4 rounded-xl font-semibold hover:bg-gray-400 transition-all"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Anterior
                  </button>
                )}
                {pasoActual < pasosInfo.length && (
                  <button
                    type="button"
                    onClick={siguientePaso}
                    className="w-40 ml-auto flex items-center justify-center bg-indigo-600 text-white py-2 px-4 rounded-xl font-semibold hover:bg-indigo-700 transition-all"
                  >
                    Siguiente
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                )}
                {pasoActual === pasosInfo.length && (
                  <button
                    type="submit"
                    className="w-50 bg-gradient-to-br from-indigo-600 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all transform hover:scale-[1.01] shadow-lg hover:shadow-indigo-200/50"
                  >
                    Subir podcast
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubirPodcast;