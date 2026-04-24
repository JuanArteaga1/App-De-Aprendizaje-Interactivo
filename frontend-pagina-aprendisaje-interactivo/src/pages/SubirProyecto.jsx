import React, { useEffect, useState } from "react";
import MenuLateral from "../components/MenuAdmi_Doc";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useProyectos } from "../context/ProyectoContext";
import { UseCategoria } from "../context/CategoriaContext";
import Alerta from "../components/AlertasDocente";
import { useLogin } from "../context/LoginContext";
import { GetAllMateria } from "../api/AdmiMateria";
import { Image, Upload, FileUp, ArrowRight, ArrowLeft, FileText, Sliders, UploadCloud, Plus, Trash2 } from "lucide-react";

function SubirProyecto() {
  const { register, handleSubmit, watch, formState: { errors }, reset, trigger } = useForm({
    defaultValues: { autores: [""] }
  });

  const { sigout, Proyectos, errors: ProyectosErrors, mensaje, setMensaje, setErrors } = useProyectos();
  const { TraerCategoria, Categoria } = UseCategoria();
  const { Usuario } = useLogin();
  const navigate = useNavigate();
  const [pasoActual, setPasoActual] = useState(1);
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  const [materias, setMaterias] = useState([]);
  const archivoAPK = watch('urlArchivoapk');
  const portada = watch('portada');
  const urlDoc = watch('urlDoc');

  const cargarMaterias = async () => {
    try {
      const res = await GetAllMateria();
      setMaterias(res.data);
    } catch (error) {
      console.error("Error cargando materias", error);
    }
  };

  const camposPaso1 = ['nombre_proyecto', 'autores', 'fechaPublicacion', 'descripcion'];
  const camposPaso2 = ['materia', 'categoriaId', 'youtubeLink'];
  const camposPaso3 = ['urlArchivoapk', 'portada', 'urlDoc'];

  // 1. Mejora: Nombres de pasos y descripción más claras
  const pasosInfo = [
    { id: 1, titulo: 'Información Básica', subtitulo: 'Nombre y autores del proyecto', icono: <FileText className="w-5 h-5" /> },
    { id: 2, titulo: 'Clasificación', subtitulo: 'Materia, categoría y video demo', icono: <Sliders className="w-5 h-5" /> },
    { id: 3, titulo: 'Archivos Finales', subtitulo: 'APK, Portada y Documentación', icono: <UploadCloud className="w-5 h-5" /> },
  ];

  useEffect(() => {
    TraerCategoria();
    cargarMaterias();
  }, []);

  useEffect(() => {

    if (ProyectosErrors.length > 0) {
      const timer = setTimeout(() => setErrors([]), 3000);
      return () => clearTimeout(timer);
    }
  }, [ProyectosErrors]);

  const siguientePaso = async () => {
    let camposAValidar = [];
    if (pasoActual === 1) camposAValidar = camposPaso1;
    if (pasoActual === 2) camposAValidar = camposPaso2;
    // El paso 3 se valida al hacer submit.

    // 2. Mejora: Validar todos los campos del paso actual
    const esValido = await trigger(camposAValidar);

    if (esValido) {
      if (pasoActual < pasosInfo.length) {
        setPasoActual(pasoActual + 1);
      }
    }
  };

  const pasoAnterior = () => {
    if (pasoActual > 1) {
      setPasoActual(pasoActual - 1);
    }
  };

  // Función para obtener el estado visual de cada paso
  const getPasoStatus = (pasoId) => {
    if (pasoId === pasoActual) return 'active';
    if (pasoId < pasoActual) return 'complete';
    return 'upcoming';
  };

  // Componente de indicador de archivo (simplificación visual)
  const FileIndicator = ({ fileName, error, Icon, requiredText, acceptedType }) => {
    const isUploaded = !!fileName;
    const isError = !!error;
    const baseClasses = "flex flex-col items-center justify-center w-full max-w-xs aspect-square border-2 transition-all duration-300 rounded-2xl shadow-lg";
    
    let borderClass = 'border-gray-300 hover:border-indigo-500 bg-gray-50';
    let iconClass = 'text-gray-500';
    let textClass = 'text-gray-600';

    if (isUploaded && !isError) {
      borderClass = 'border-green-500 bg-green-50 shadow-green-200/50';
      iconClass = 'text-green-500';
      textClass = 'text-green-600 font-medium';
    } else if (isError) {
      borderClass = 'border-red-500 bg-red-50 shadow-red-200/50';
      iconClass = 'text-red-500';
      textClass = 'text-red-600 font-medium';
    } else {
       // Estilo para el estado por defecto o hover
       borderClass = 'border-dashed border-gray-300 hover:border-indigo-600 bg-white hover:bg-indigo-50/50';
       iconClass = 'text-indigo-400';
       textClass = 'text-gray-600';
    }

    return (
      <div className={`${baseClasses} ${borderClass} cursor-pointer p-4`}>
        <div className={`w-12 h-12 flex items-center justify-center rounded-full ${iconClass} mb-2`}>
          {React.cloneElement(Icon, { className: "w-8 h-8" })}
        </div>
        <p className="text-center text-sm font-medium mb-1 truncate w-full px-2">
          {isUploaded ? fileName : `Subir ${requiredText}`}
        </p>
        <p className="text-xs text-center text-gray-400 mb-2">
           {acceptedType} (Máx 10MB)
        </p>
        {isUploaded && !isError && (
          <p className="text-xs font-semibold text-green-500">¡Archivo Cargado!</p>
        )}
        {isError && (
          <p className="text-xs font-semibold text-red-500 px-1 text-center">{error}</p>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sistema de Alertas (Mantener fuera del flujo para la posición fija) */}
      {mensaje && (
        <div className="fixed top-5 right-5 z-50 animate-fadeInDown">
          <Alerta tipo="exito" mensaje={mensaje} onClose={() => setMensaje(null)} />
        </div>
      )}

      {ProyectosErrors.length > 0 && (
        <div className="fixed top-5 right-5 z-50 space-y-2">
          {ProyectosErrors.map((error, i) => (
            <Alerta key={i} tipo="error" mensaje={error.msg} />
          ))}
        </div>
      )}

      <MenuLateral rol="docente" />

      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        {/* Contenedor principal con Título */}
        <div className="max-w-5xl mx-auto pt-6">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">
                 Subir Nuevo Proyecto
            </h1>

          {/* Indicador de pasos Mejorado */}
          <div className="mb-12 bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex justify-between items-start relative w-full">
              {/* Línea de progreso (Ahora con color dinámico) */}
              <div 
                className="absolute left-0 right-0 h-1 bg-gray-200 z-0 top-1/2 -translate-y-1/2 mx-8 rounded-full"
                aria-hidden="true"
              >
                <div 
                    className="absolute h-full bg-indigo-500 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${((pasoActual - 1) / (pasosInfo.length - 1)) * 100}%` }}
                ></div>
              </div>


              {pasosInfo.map((paso) => (
                <div key={paso.id} className="flex flex-col items-center relative z-10 flex-1">
                  <div
                    className={`w-12 h-12 flex items-center justify-center rounded-full text-white font-bold transition-all duration-500 transform
                    ${getPasoStatus(paso.id) === 'active' ? 'bg-indigo-600 shadow-xl shadow-indigo-300/50 scale-105' : 
                      getPasoStatus(paso.id) === 'complete' ? 'bg-green-500 border-2 border-white' : 
                      'bg-gray-400 border-2 border-white'
                    }`}
                  >
                    {/* El icono de Lucide es ya un componente, no necesitamos cloneElement aquí si solo cambiamos el wrapper */}
                    {paso.icono}
                  </div>
                  <div className={`text-center mt-3 transition-colors duration-300 ${getPasoStatus(paso.id) === 'active' ? 'text-indigo-600 font-bold' : 'text-gray-600 font-medium'}`}>
                    <p className="text-sm sm:text-base whitespace-nowrap">{paso.titulo}</p>
                    <p className="hidden sm:block text-xs text-gray-400">{paso.subtitulo}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>


          <form
            onSubmit={handleSubmit(async (data) => {
              // Validar paso 3 justo antes de enviar
              const esPaso3Valido = await trigger(camposPaso3);
              if (!esPaso3Valido) return; // Detener el submit si hay errores

              const formData = new FormData();
              formData.append("nombre_proyecto", data.nombre_proyecto);
              formData.append("autores", JSON.stringify(data.autores.filter(a => a.trim() !== ''))); // Limpiar autores vacíos
              formData.append("fechaPublicacion", data.fechaPublicacion);
              formData.append("descripcion", data.descripcion);
              formData.append("materia", data.materia);
              formData.append("youtubeLink", data.youtubeLink || "");
              formData.append("categoriaId", data.categoriaId);
              formData.append("urlArchivoapk", data.urlArchivoapk?.[0]);
              formData.append("portada", data.portada?.[0]);
              formData.append("urlDoc", data.urlDoc?.[0]);
              formData.append("Usuario", Usuario.id);
              formData.append("seccion", "Proyectos");

              const resultado = await sigout(formData);
              if (resultado?.success) {
                navigate("/misproyectos", {
                  state: {
                    mensaje: "Proyecto creado correctamente.",
                    tipo: "success",
                  },
                });
              }
            })}
            className="space-y-8 bg-white p-6 sm:p-10 rounded-3xl shadow-2xl border border-gray-100"
          >
            {/* Contenido del Paso 1 */}
            {pasoActual === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-2xl font-extrabold text-indigo-700 border-b pb-2 border-indigo-100">
                    <FileText className="inline-block w-6 h-6 mr-2 mb-1 text-indigo-500"/>
                    {pasosInfo[0].titulo}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  {/* Nombre del Proyecto */}
                  <div>
                    <label htmlFor="nombre_proyecto" className="block text-sm font-medium text-gray-700 mb-1">Nombre de la aplicación <span className="text-red-500">*</span></label>
                    <input
                      id="nombre_proyecto"
                      {...register('nombre_proyecto', { required: "El nombre es requerido" })}
                      type="text"
                      placeholder="Ej: Fuerzas Electromagnéticas"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                    />
                    {errors.nombre_proyecto && (<p className="mt-1 text-red-500 text-sm font-medium">{errors.nombre_proyecto.message}</p>)}
                  </div>

                  {/* Autores */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Autores <span className="text-red-500">*</span></label>
                    {watch('autores')?.map((_, index) => (
                      <div key={index} className="flex items-center gap-2 mb-3">
                        <input
                          {...register(`autores.${index}`, { required: "Autor es requerido" })}
                          type="text"
                          placeholder={`Nombre del Autor ${index + 1}`}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                        />
                        {watch('autores').length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const currentAutores = [...watch('autores')];
                              currentAutores.splice(index, 1);
                              reset({ ...watch(), autores: currentAutores });
                            }}
                            className="p-3 text-red-400 hover:text-red-600 transition-colors bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const currentAutores = watch('autores') || [];
                        reset({ ...watch(), autores: [...currentAutores, ""] });
                      }}
                      className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors text-sm font-medium mt-1"
                    >
                      <Plus className="w-4 h-4 mr-1"/>
                      Añadir otro autor
                    </button>
                    {errors.autores && typeof errors.autores === 'object' && errors.autores.message && (
                        <p className="mt-1 text-red-500 text-sm font-medium">{errors.autores.message}</p>
                    )}
                  </div>

                  {/* Descripción */}
                  <div className="md:col-span-2">
                    <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">Descripción del proyecto <span className="text-red-500">*</span></label>
                    <textarea
                      id="descripcion"
                      {...register('descripcion', { required: "La descripción es requerida" })}
                      rows="4"
                      placeholder="Una breve descripción de lo que trata la aplicación, sus objetivos y público objetivo."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-shadow resize-none"
                    />
                    {errors.descripcion && (<p className="mt-1 text-red-500 text-sm font-medium">{errors.descripcion.message}</p>)}
                  </div>

                  {/* Fecha de realización */}
                  <div>
                    <label htmlFor="fechaPublicacion" className="block text-sm font-medium text-gray-700 mb-1">Fecha de realización <span className="text-red-500">*</span></label>
                    <input
                      id="fechaPublicacion"
                      {...register('fechaPublicacion', { required: "La fecha es requerida" })}
                      type="datetime-local"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                    />
                    {errors.fechaPublicacion && (<p className="mt-1 text-red-500 text-sm font-medium">{errors.fechaPublicacion.message}</p>)}
                  </div>
                </div>
              </div>
            )}

            {/* Contenido del Paso 2 */}
            {pasoActual === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-2xl font-extrabold text-indigo-700 border-b pb-2 border-indigo-100">
                    <Sliders className="inline-block w-6 h-6 mr-2 mb-1 text-indigo-500"/>
                    {pasosInfo[1].titulo}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Categoría */}
                  <div>
                    <label htmlFor="categoriaId" className="block text-sm font-medium text-gray-700 mb-1">Categoría <span className="text-red-500">*</span></label>
                    <select
                      id="categoriaId"
                      {...register('categoriaId', { required: "La categoría es requerida" })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-shadow bg-white"
                    >
                      <option value="">-- Seleccionar categoría --</option>
                      {Categoria && Categoria.map((categoria) => (
                        <option key={categoria.id} value={categoria.id}>
                          {categoria.Nombre_Categoria}
                        </option>
                      ))}
                    </select>
                    {errors.categoriaId && (<p className="mt-1 text-red-500 text-sm font-medium">{errors.categoriaId.message}</p>)}
                  </div>

                  {/* Materia */}
                  <div>
                    <label htmlFor="materia" className="block text-sm font-medium text-gray-700 mb-1">Materia asociada <span className="text-red-500">*</span></label>
                    <select
                      id="materia"
                      {...register('materia', { required: "La materia es requerida" })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-shadow bg-white"
                    >
                      <option value="">-- Seleccionar materia --</option>
                      {materias.map((materia) => (
                        <option key={materia._id || materia.id} value={materia.nombre}>
                          {materia.nombre}
                        </option>
                      ))}
                    </select>
                    {errors.materia && (<p className="mt-1 text-red-500 text-sm font-medium">{errors.materia.message}</p>)}
                  </div>

                  {/* Link de YouTube */}
                  <div className="md:col-span-2">
                    <label htmlFor="youtubeLink" className="block text-sm font-medium text-gray-700 mb-1">Link de YouTube (Video Demostrativo) <span className="text-red-500">*</span></label>
                    <input
                      id="youtubeLink"
                      {...register('youtubeLink', {
                        required: 'El enlace de YouTube es obligatorio',
                        pattern: {
                          value: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
                          message: 'Ingrese un enlace válido de YouTube',
                        },
                      })}
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=tu_video_aqui"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                    />
                    {errors.youtubeLink && (
                      <p className="mt-1 text-red-500 text-sm font-medium">{errors.youtubeLink.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )}


            {/* Contenido del Paso 3 - Mejora en Dropzones */}
            {pasoActual === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-2xl font-extrabold text-indigo-700 border-b pb-2 border-indigo-100">
                    <UploadCloud className="inline-block w-6 h-6 mr-2 mb-1 text-indigo-500"/>
                    {pasosInfo[2].titulo}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center pt-4">
                  {/* Dropzone APK */}
                  <label>
                    <input
                      type="file"
                      className="hidden"
                      accept=".apk"
                      {...register('urlArchivoapk', {
                        required: 'Se requiere la APK del proyecto',
                        validate: {
                          tamaño: (archivos) => archivos?.[0]?.size <= MAX_SIZE || 'El archivo supera los 10MB',
                          tipo: (archivos) => archivos?.[0]?.name?.toLowerCase().endsWith('.apk') || 'El archivo debe ser .apk',
                        },
                      })}
                    />
                    <FileIndicator
                        fileName={archivoAPK?.[0]?.name}
                        error={errors.urlArchivoapk?.message}
                        Icon={<Upload />}
                        requiredText="Archivo APK"
                        acceptedType=".apk file"
                    />
                  </label>
                  
                  {/* Dropzone Imagen/Portada */}
                  <label>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      {...register('portada', {
                        required: 'Se requiere una imagen de portada',
                        validate: {
                          tamaño: (archivos) => archivos?.[0]?.size <= MAX_SIZE || 'La imagen supera los 10MB',
                          tipo: (archivos) => /\.(jpg|jpeg|png|webp)$/i.test(archivos?.[0]?.name) || 'Debe ser imagen (.jpg, .png, etc.)',
                        },
                      })}
                    />
                    <FileIndicator
                        fileName={portada?.[0]?.name}
                        error={errors.portada?.message}
                        Icon={<Image />}
                        requiredText="Imagen de Portada"
                        acceptedType=".jpg, .png, .webp"
                    />
                  </label>

                  {/* Dropzone Documento PDF */}
                  <label>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf"
                      {...register('urlDoc', {
                        required: 'Se requiere el documento de respaldo (PDF)',
                        validate: {
                          tamaño: (archivos) => archivos?.[0]?.size <= MAX_SIZE || 'El documento es muy pesado (Máx 10MB)',
                          tipo: (archivos) => archivos?.[0]?.name?.toLowerCase().endsWith('.pdf') || 'El archivo debe ser un PDF',
                        },
                      })}
                    />
                    <FileIndicator
                        fileName={urlDoc?.[0]?.name}
                        error={errors.urlDoc?.message}
                        Icon={<FileUp />}
                        requiredText="Documento PDF"
                        acceptedType=".pdf file"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Navegación y Botón Final */}
            <div className={`flex ${pasoActual > 1 ? 'justify-between' : 'justify-end'} pt-6 border-t border-gray-100`}>
              {pasoActual > 1 && (
                <button
                  type="button"
                  onClick={pasoAnterior}
                  className="w-40 flex items-center justify-center bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-300 transition-all transform hover:scale-[1.02] shadow-md"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Anterior
                </button>
              )}
              
              {pasoActual < pasosInfo.length && (
                <button
                  type="button"
                  onClick={siguientePaso}
                  className={`${pasoActual === 1 ? 'ml-auto' : ''} w-40 flex items-center justify-center bg-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-indigo-700 transition-all transform hover:scale-[1.02] shadow-lg shadow-indigo-200/50`}
                >
                  Siguiente
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              )}
              
              {/* 3. Mejora: Botón de Submit llamativo */}
              {pasoActual === pasosInfo.length && (
                <button
                  type="submit"
                  className="w-full sm:w-60 ml-auto bg-gradient-to-br from-indigo-600 to-blue-600 text-white py-4 px-6 rounded-xl font-extrabold text-lg hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all transform hover:scale-[1.03] shadow-xl hover:shadow-indigo-400/70 animate-pulse-once"
                >
                  🎉 Subir Proyecto
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default SubirProyecto;

// Estilos de animación simple para Tailwind (asumiendo que tienes configurado el `tailwind.config.js`)
/* module.exports = {
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out',
        'pulse-once': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) 1',
      },
    },
  },
}
*/