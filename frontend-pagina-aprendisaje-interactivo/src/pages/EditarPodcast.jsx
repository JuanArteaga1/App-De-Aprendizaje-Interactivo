import React, { useEffect, useState } from "react";
import MenuLateral from "../components/MenuAdmi_Doc";
import { useForm } from "react-hook-form";
import { usePodcast } from "../context/PodcastContext";
import Alerta from "../components/AlertasDocente";
import { useLogin } from "../context/LoginContext";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { UseCategoria } from "../context/CategoriaContext";
import { ImageIcon, FileText, Sliders, UploadCloud, ArrowRight, ArrowLeft } from 'lucide-react';
import { useMateriasFromBackend } from "../hooks/useMateriasFromBackend";

function EditarPodcast() {
    const location = useLocation();
    const navigate = useNavigate();
    const podcast = location.state?.podcast;
    const { errors: PodcastErros, ActualizarPodcast, TraerPodcast, mensaje, setMensaje, setErrors } = usePodcast();
    const { register, handleSubmit, setValue, watch, formState: { errors }, trigger } = useForm();
    const portadaPreview = watch("portada")?.[0];
    const [podcastActual, setPodcastActual] = useState(null);
    const { Usuario } = useLogin();
    const { TraerCategoria, Categoria } = UseCategoria();
    const { id } = useParams();
    const materias = useMateriasFromBackend();
    const [fechaFormateada, setFechaFormateada] = useState("");
    const portada = watch('portada');
    const [imagenExistente, setImagenExistente] = useState(null);
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB

    // Estado y configuración de los pasos
    const [pasoActual, setPasoActual] = useState(1);
    const pasosInfo = [
        { id: 1, titulo: 'Información General', icono: <FileText className="w-5 h-5" /> },
        { id: 2, titulo: 'Detalles', icono: <Sliders className="w-5 h-5" /> },
        { id: 3, titulo: 'Archivos', icono: <UploadCloud className="w-5 h-5" /> },
    ];

    // Campos a validar por paso
    const camposPaso1 = ["nombre_proyecto", "descripcion", "autores", "fecha"];
    const camposPaso2 = ["audioLink", "categoriaId", "materia"];
    const camposPaso3 = ["portada"];

    const siguientePaso = async () => {
        let camposAValidar = [];
        if (pasoActual === 1) camposAValidar = camposPaso1;
        if (pasoActual === 2) camposAValidar = camposPaso2;
        if (pasoActual === 3) camposAValidar = camposPaso3;

        const esValido = await trigger(camposAValidar);
        if (esValido && pasoActual < pasosInfo.length) {
            setPasoActual(pasoActual + 1);
        }
    };

    const pasoAnterior = () => {
        if (pasoActual > 1) {
            setPasoActual(pasoActual - 1);
        }
    };

    useEffect(() => {
        TraerCategoria();
    }, []);

    useEffect(() => {
        if (podcast) {
            setPodcastActual(podcast);
            setImagenExistente(podcast.portada); // Guardamos la imagen existente

            if (podcast.fechaPublicacion) {
                const fecha = new Date(podcast.fechaPublicacion);
                if (!isNaN(fecha.getTime())) {
                    const fechaFormatted = fecha.toISOString().slice(0, 16);
                    setFechaFormateada(fechaFormatted);
                    setValue("fecha", fechaFormatted);
                }
            }
            setValue("nombre_proyecto", podcast.nombre_proyecto);
            setValue("descripcion", podcast.descripcion);
            setValue("audioLink", podcast.UrlAudio);
            setValue("autores", podcast.autores);
            setValue("materia", podcast.materia);
            setValue("categoriaId", podcast.categoriaId);
        }
    }, [podcast, setValue]);

    useEffect(() => {
        if (mensaje) {
            const timer = setTimeout(() => {
                setMensaje(null);
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
        try {
            const formData = new FormData();
            formData.append("nombre_proyecto", data.nombre_proyecto);
            formData.append("descripcion", data.descripcion);
            formData.append("autores", data.autores);
            formData.append("fechaPublicacion", data.fecha);
            formData.append("materia", data.materia);
            formData.append("UrlAudio", data.audioLink);

            // Solo adjuntamos la portada si se ha subido una nueva
            if (data.portada?.[0]) {
                formData.append("portada", data.portada[0]);
            } else if (!imagenExistente) {
                // Si no hay imagen existente y no se subió una nueva, mostramos error
                setErrors([{ msg: "La imagen de portada es obligatoria" }]);
                setPasoActual(3); // Redirigimos al paso 3
                return;
            }

            formData.append("Usuario", Usuario.Id);
            formData.append("seccion", "Podcast");
            formData.append("categoriaId", data.categoriaId);

            const respuesta = await ActualizarPodcast(id, formData);
            if (respuesta?.success) {
                await TraerPodcast();
                setMensaje("Podcast actualizado correctamente");
                setTimeout(() => {
                    if (Usuario.Rol === "Docente") {
                        navigate("/misproyectos");
                    } else if (Usuario.Rol === "Administrador") {
                        navigate("/VerProyectos");
                    }
                }, 1500);
            }
        } catch (error) {
            console.error("Error al actualizar el podcast:", error);
        }
    };

    if (!podcastActual) return <p className="p-8">Cargando datos del podcast...</p>;

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
                                            <input
                                                type="text"
                                                {...register("autores", { required: "El nombre del autor es obligatorio" })}
                                                placeholder="Autores del podcast"
                                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm 
                          focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            {errors.autores && (
                                                <p className="mt-1 text-red-500 text-sm">{errors.autores.message}</p>
                                            )}
                                        </div>

                                        {/* Fecha */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Fecha de Publicación</label>
                                            <input
                                                type="datetime-local"
                                                {...register("fecha", { required: true })}
                                                value={fechaFormateada}
                                                onChange={(e) => {
                                                    setFechaFormateada(e.target.value);
                                                    setValue("fecha", e.target.value);
                                                }}
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
                                                {...register("materia", { required: true })}
                                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm 
                          focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="">Seleccionar materia</option>
                                                {materias.map((m) => (
                                                    <option key={m._id || m.id} value={m.nombre}>
                                                        {m.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.materia && (
                                                <p className="mt-1 text-red-500 text-sm">La materia es requerida</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Contenido del Paso 3 */}
                            {pasoActual === 3 && (
                                <div className="space-y-6">
                                    <h3 className="text-xl font-semibold text-gray-700">Paso 3: Archivos</h3>
                                    <div className="space-y-2">
                                        <label className="block text-base font-semibold text-gray-800">Subir Portada</label>
                                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-6 cursor-pointer hover:border-indigo-500 bg-gray-50 hover:bg-indigo-50 transition-colors group">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                {...register("portada", {
                                                    required: !imagenExistente && "La imagen de portada es obligatoria",
                                                    validate: {
                                                        tamaño: (archivos) =>
                                                            !archivos?.[0] || archivos[0]?.size <= MAX_SIZE || 'La imagen supera los 10MB',
                                                        tipo: (archivos) =>
                                                            !archivos?.[0] || /\.(jpg|jpeg|png|webp)$/i.test(archivos?.[0]?.name || '') || 'El archivo debe ser una imagen válida (.jpg, .jpeg, .png, .webp)',
                                                    },
                                                })}
                                            />
                                            {portada?.[0] ? (
                                                <span className="text-sm text-gray-700 mt-1">{portada[0].name}</span>
                                            ) : imagenExistente ? (
                                                <span className="text-sm text-gray-700 mt-1">Imagen existente: {imagenExistente}</span>
                                            ) : null}

                                            {portada?.length > 0 && !errors.portada && (
                                                <p className="text-green-500 text-center font-semibold text-sm">Imagen subida correctamente</p>
                                            )}
                                            {errors.portada && (
                                                <p className="text-red-500 font-semibold text-sm">{errors.portada.message}</p>
                                            )}

                                            {!portada?.[0] && !imagenExistente && (
                                                <>
                                                    <ImageIcon className="w-10 h-10 text-black opacity-50" />
                                                    <span className="text-sm">Imagen de la portada</span>
                                                </>
                                            )}
                                        </label>
                                    </div>

                                    {(portadaPreview || imagenExistente) && (
                                        <div className="mt-4">
                                            <h4 className="text-sm font-semibold text-gray-800 mb-2">Vista previa de la portada:</h4>
                                            <img
                                                src={portadaPreview ? URL.createObjectURL(portadaPreview) : `http://localhost:4000/uploads/${imagenExistente}`}
                                                alt="Portada"
                                                className="max-w-xs rounded-xl shadow-md border-2 border-gray-100"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Botones de navegación */}
                            <div className="flex justify-between pt-4">
                                <div>
                                    {pasoActual > 1 && (
                                        <button
                                            type="button"
                                            onClick={pasoAnterior}
                                            className="w-40 flex items-center justify-center bg-gray-300 text-gray-800 py-2 px-4 rounded-xl font-semibold hover:bg-gray-400"
                                        >
                                            <ArrowLeft className="w-4 h-4 mr-2" /> Anterior
                                        </button>
                                    )}
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => navigate("/misproyectos")}
                                        className="w-40 flex items-center justify-center bg-gray-300 text-gray-800 py-2 px-4 rounded-xl font-semibold hover:bg-gray-400"
                                    >
                                        Cancelar
                                    </button>

                                    {pasoActual < pasosInfo.length ? (
                                        <button
                                            type="button"
                                            onClick={siguientePaso}
                                            className="w-40 flex items-center justify-center bg-indigo-600 text-white py-2 px-4 rounded-xl font-semibold hover:bg-indigo-700"
                                        >
                                            Siguiente <ArrowRight className="w-4 h-4 ml-2" />
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            className="w-50 bg-gradient-to-br from-indigo-600 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700"
                                        >
                                            Actualizar Podcast
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditarPodcast;