import React, { useEffect, useState } from "react";
import MenuLateral from "../components/MenuAdmi_Doc";
import { useForm } from "react-hook-form";
import { useProyectos } from "../context/ProyectoContext";
import { UseCategoria } from "../context/CategoriaContext";
import { useLogin } from "../context/LoginContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Alerta from "../components/AlertasDocente";
import { Image, Upload, FileUp, ArrowRight, ArrowLeft, FileText, Sliders, UploadCloud } from "lucide-react";
import { useMateriasFromBackend } from "../hooks/useMateriasFromBackend";

function EditarProyecto() {
    const location = useLocation();
    const navigate = useNavigate();
    const proyecto = location.state?.proyecto;
    const { errors: ProyectosErrors, mensaje, ActualizarProyectos, setErrors } = useProyectos();
    const { TraerCategoria, Categoria } = UseCategoria();
    const { Usuario } = useLogin();
    const { id } = useParams();
    const materias = useMateriasFromBackend();

    const [pasoActual, setPasoActual] = useState(1);
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB

    // Initialize default values with existing project data
    const { register, handleSubmit, watch, formState: { errors }, setValue, trigger } = useForm({
        defaultValues: {
            nombre_proyecto: proyecto?.nombre_proyecto || "",
            // Corregido: Separa la cadena de autores por comas para crear un array.
            autores: proyecto?.autores || [""],
            fechaPublicacion: proyecto?.fechaPublicacion?.substring(0, 16) || "",
            descripcion: proyecto?.descripcion || "",
            materia: proyecto?.materia || "",
            categoriaId: proyecto?.categoriaId || "",
            youtubeLink: proyecto?.youtubeLink || "",
            // File inputs will be handled separately
        },
    });

    const archivoAPK = watch('urlArchivoapk');
    const portada = watch('portada');
    const urlDoc = watch('urlDoc');

    const camposPaso1 = ['nombre_proyecto', 'autores', 'fechaPublicacion', 'descripcion'];
    const camposPaso2 = ['materia', 'categoriaId', 'youtubeLink'];
    const camposPaso3 = ['urlArchivoapk', 'portada', 'urlDoc'];

    const pasosInfo = [
        { id: 1, titulo: 'Información General', icono: <FileText className="w-5 h-5 mr-2" /> },
        { id: 2, titulo: 'Detalles ', icono: <Sliders className="w-5 h-5 mr-2" /> },
        { id: 3, titulo: 'Archivos', icono: <UploadCloud className="w-5 h-5 mr-2" /> },
    ];

    useEffect(() => {
        TraerCategoria();
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
        if (pasoActual === 3) camposAValidar = camposPaso3;

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

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            formData.append("nombre_proyecto", data.nombre_proyecto);
            // Corregido: Convierte el array de autores a una cadena separada por comas.
            formData.append("autores", JSON.stringify(data.autores));
            formData.append("fechaPublicacion", data.fechaPublicacion);
            formData.append("descripcion", data.descripcion);
            formData.append("materia", data.materia);
            formData.append("categoriaId", data.categoriaId);
            formData.append("youtubeLink", data.youtubeLink || "");

            // Append files only if they exist in the watch object
            if (data.urlArchivoapk && data.urlArchivoapk[0]) formData.append("urlArchivoapk", data.urlArchivoapk[0]);
            if (data.portada && data.portada[0]) formData.append("portada", data.portada[0]);
            if (data.urlDoc && data.urlDoc[0]) formData.append("urlDoc", data.urlDoc[0]);

            formData.append("Usuario", Usuario.Id);
            formData.append("seccion", "Proyectos");

            const respuesta = await ActualizarProyectos(id, formData);
            if (respuesta?.success) {
                navigate("/misproyectos", {
                    state: {
                        mensaje: "Proyecto actualizado correctamente",
                        tipo: "success",
                    },
                });
            }
        } catch (error) {
            console.error("Error al actualizar el proyecto:", error);
            alert("Hubo un error al actualizar el proyecto");
        }
    };

    if (!proyecto) {
        return <p className="p-8 text-center text-red-500">No se encontró el proyecto.</p>;
    }

    const handleCancel = () => {
        navigate("/misproyectos");
    };

    const handleAddAuthor = () => {
      const currentAutores = watch('autores');
      setValue('autores', [...currentAutores, '']);
    };

    const handleRemoveAuthor = (index) => {
      const currentAutores = watch('autores');
      const newAutores = currentAutores.filter((_, i) => i !== index);
      setValue('autores', newAutores);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {mensaje && (
                <div className="fixed top-5 right-5 z-50">
                    <Alerta tipo="exito" mensaje={mensaje} />
                </div>
            )}
            {ProyectosErrors.length > 0 && (
                <div className="fixed top-20 right-5 z-50 space-y-2">
                    {ProyectosErrors.map((error, i) => (
                        <Alerta key={i} tipo="error" mensaje={error.msg} />
                    ))}
                </div>
            )}
            <MenuLateral rol="docente" />
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                    {/* Step Indicator */}
                    <div className="mb-12">
                        <div className="flex justify-between items-center relative w-full">
                            <div className="absolute left-0 right-0 h-1 bg-gray-300 z-0 top-1/3 mx-6"></div>
                            {pasosInfo.map((paso) => (
                                <React.Fragment key={paso.id}>
                                    <div className="flex flex-col items-center relative z-10 flex-1">
                                        <span
                                            className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full text-white font-bold transition-colors duration-300 ${pasoActual === paso.id ? 'bg-blue-600 shadow-md' : 'bg-gray-400'}`}
                                        >
                                            {React.cloneElement(paso.icono, { className: "w-5 h-5 sm:w-6 sm:h-6" })}
                                        </span>
                                        <div
                                            className={`text-center mt-2 text-xs sm:text-sm whitespace-nowrap ${pasoActual === paso.id ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}
                                        >
                                            {paso.titulo}
                                        </div>
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-2xl shadow-xl">
                        {pasoActual === 1 && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold text-gray-700">Paso 1: Información General</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Nombre del proyecto</label>
                                        <input
                                            defaultValue={proyecto.nombre_proyecto}
                                            {...register('nombre_proyecto', { required: true })}
                                            type="text"
                                            placeholder="Ejemplo: Fuerzas Electromagneticas"
                                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        {errors.nombre_proyecto && (<p className="mt-1 text-red-500 text-sm">El nombre es requerido</p>)}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Autores</label>
                                        {watch('autores')?.map((_, index) => (
                                            <div key={index} className="flex items-center gap-2 mb-2">
                                                <input
                                                    {...register(`autores.${index}`, { required: true })}
                                                    type="text"
                                                    placeholder={`Autor ${index + 1}`}
                                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                />
                                                {watch('autores').length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveAuthor(index)}
                                                        className="text-gray-500 hover:text-red-600 transition-colors"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={handleAddAuthor}
                                            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                                            Añadir autor
                                        </button>
                                        {errors.autores && (
                                            <p className="mt-1 text-red-500 text-sm">Se requiere al menos un autor</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Descripción</label>
                                        <textarea
                                            defaultValue={proyecto.descripcion}
                                            {...register('descripcion', { required: true })}
                                            rows="4"
                                            placeholder="Una breve descripción de lo que trata la aplicación"
                                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        {errors.descripcion && (<p className="mt-1 text-red-500 text-sm">Descripción es requerida</p>)}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Fecha de realización</label>
                                        <input
                                            defaultValue={proyecto.fechaPublicacion?.substring(0, 16)}
                                            {...register('fechaPublicacion', { required: true })}
                                            type="datetime-local"
                                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        {errors.fechaPublicacion && (<p className="mt-1 text-red-500 text-sm">La fecha es requerida</p>)}
                                    </div>
                                </div>
                            </div>
                        )}
                        {pasoActual === 2 && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold text-gray-700">Paso 2: Detalles Adicionales</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Categoría</label>
                                        <select
                                            defaultValue={proyecto.categoriaId}
                                            {...register('categoriaId', { required: true })}
                                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Seleccionar categoría</option>
                                            {Categoria && Categoria.map((categoria) => (
                                                <option key={categoria.id} value={categoria.id}>
                                                    {categoria.Nombre_Categoria}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.categoriaId && (<p className="mt-1 text-red-500 text-sm">Categoría es requerida</p>)}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Materia</label>
                                        <select
                                            {...register('materia', { required: true })}
                                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Seleccionar materia</option>
                                            {materias.map((m) => (
                                                <option key={m._id || m.id} value={m.nombre}>
                                                    {m.nombre}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.materia && (<p className="mt-1 text-red-500 text-sm">Materia es requerida</p>)}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Link de YouTube</label>
                                        <input
                                            defaultValue={proyecto.youtubeLink || ""}
                                            {...register('youtubeLink', {
                                                required: 'El enlace de YouTube es obligatorio',
                                                pattern: {
                                                    value: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
                                                    message: 'Ingrese un enlace válido de YouTube',
                                                },
                                            })}
                                            type="url"
                                            placeholder="https://www.youtube.com"
                                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        {errors.youtubeLink && (
                                            <p className="mt-1 text-red-500 text-sm">{errors.youtubeLink.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        {pasoActual === 3 && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold text-gray-700">Paso 3: Carga de Archivos</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                                    {/* File Upload for APK */}
                                    <label className="flex flex-col items-center justify-center w-full max-w-[220px] aspect-square border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors hover:shadow-md">
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept=".apk"
                                            {...register('urlArchivoapk', {
                                                required: "El archivo APK es obligatorio",
                                                validate: {
                                                    tamaño: (archivos) => !archivos[0] || archivos[0].size <= MAX_SIZE || 'El archivo supera los 10MB',
                                                    tipo: (archivos) => !archivos[0] || archivos[0].name.toLowerCase().endsWith('.apk') || 'El archivo debe ser .apk',
                                                },
                                            })}
                                        />
                                        {archivoAPK?.[0] ? (
                                            <span className="text-center text-sm text-gray-700 mt-1 px-2">{archivoAPK?.[0].name}</span>
                                        ) : (
                                            <>
                                                <Upload className="w-8 h-8 text-black opacity-50" />
                                                <span className="text-sm text-gray-600 mt-1">Subir APK</span>
                                            </>
                                        )}
                                        {archivoAPK?.length > 0 && !errors.urlArchivoapk && (<p className="text-green-500 text-center font-semibold text-sm">APK subida</p>)}
                                        {errors.urlArchivoapk && (<p className="text-red-500 text-center font-semibold text-sm px-2">{errors.urlArchivoapk.message}</p>)}
                                    </label>
                                    {/* File Upload for Cover Image */}
                                    <label className="flex flex-col items-center justify-center w-full max-w-[220px] aspect-square border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors hover:shadow-md">
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            {...register('portada', {
                                                required: "La imagen es obligatoria",
                                                validate: {
                                                    tamaño: (archivos) => !archivos[0] || archivos[0].size <= MAX_SIZE || 'La imagen supera los 10MB',
                                                    tipo: (archivos) => !archivos[0] || /\.(jpg|jpeg|png|webp)$/i.test(archivos[0].name) || 'El archivo debe ser una imagen (.jpg, .jpeg, .png, .webp)',
                                                },
                                            })}
                                        />
                                        {portada?.[0] ? (
                                            <span className="text-sm text-center text-gray-700 mt-1 break-words w-full px-2 max-w-[220px]">{portada?.[0].name}</span>
                                        ) : (
                                            <>
                                                <Image className="w-8 h-8 text-black opacity-50" />
                                                <span className="text-sm text-gray-600 mt-1">Subir IMG</span>
                                            </>
                                        )}
                                        {portada?.length > 0 && !errors.portada && (<p className="text-green-500 text-center font-semibold text-sm">Imagen subida</p>)}
                                        {errors.portada && (<p className="text-red-500 text-center font-semibold text-sm px-2">{errors.portada.message}</p>)}
                                    </label>
                                    {/* File Upload for Document */}
                                    <label className="flex flex-col items-center justify-center w-full max-w-[220px] aspect-square border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors hover:shadow-md">
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept=".pdf"
                                            {...register('urlDoc', {
                                                required: "El documento PDF es obligatorio",
                                                validate: {
                                                    tamaño: (archivos) => !archivos[0] || archivos[0].size <= MAX_SIZE || 'El documento es muy pesado',
                                                    tipo: (archivos) => !archivos[0] || archivos[0].name?.toLowerCase().endsWith('.pdf') || 'El archivo debe ser un PDF',
                                                },
                                            })}
                                        />
                                        {urlDoc?.[0] ? (
                                            <span className="text-sm text-center text-gray-700 mt-1 break-words w-full px-2 max-w-[220px]">{urlDoc?.[0].name}</span>
                                        ) : (
                                            <>
                                                <FileUp className="w-8 h-8 text-black opacity-50" />
                                                <span className="text-sm text-gray-600 mt-1">Subir PDF</span>
                                            </>
                                        )}
                                        {urlDoc?.length > 0 && !errors.urlDoc && (<p className="text-green-500 text-center font-semibold text-sm">Documento subido</p>)}
                                        {errors.urlDoc && (<p className="text-red-500 text-center font-semibold text-sm px-2">{errors.urlDoc.message}</p>)}
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Botones de navegación */}
                        <div className="flex justify-between pt-4">
                            <div>
                                {pasoActual > 1 && (
                                    <button
                                        type="button"
                                        onClick={pasoAnterior}
                                        className="w-40 flex items-center justify-center bg-gray-300 text-gray-800 py-2 px-4 rounded-xl font-semibold hover:bg-gray-400 transition-all"
                                    >
                                        <ArrowLeft className="w-4 h-4 mr-2" /> Anterior
                                    </button>
                                )}
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="w-40 flex items-center justify-center bg-gray-300 text-gray-800 py-2 px-4 rounded-xl font-semibold hover:bg-gray-400 transition-all"
                                >
                                    Cancelar
                                </button>

                                {pasoActual < pasosInfo.length ? (
                                    <button
                                        type="button"
                                        onClick={siguientePaso}
                                        className="w-40 flex items-center justify-center bg-indigo-600 text-white py-2 px-4 rounded-xl font-semibold hover:bg-indigo-700 transition-all"
                                    >
                                        Siguiente <ArrowRight className="w-4 h-4 ml-2" />
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        className="w-50 bg-gradient-to-br from-indigo-600 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all transform hover:scale-[1.01] shadow-lg hover:shadow-indigo-200/50"
                                    >
                                        Actualizar Proyecto
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default EditarProyecto;