import { useEffect, useState } from "react";
import React from "react";
import MenuLateral from "../components/MenuAdmi_Doc";
import { useForm } from "react-hook-form"
import { UseSimulaciones } from "../context/SimulacionesContex";
import Alerta from "../components/AlertasDocente";
import { useLogin } from "../context/LoginContext"
import { UseCategoria } from "../context/CategoriaContext"
import { GetAllMateria } from "../api/AdmiMateria";
import { Image, Upload as UploadIcon, FileUp, ArrowRight, ArrowLeft, FileText, Sliders, UploadCloud } from "lucide-react";


const SubirAPK = () => {

    const { register, handleSubmit, watch, formState: { errors }, reset, trigger } = useForm({
        defaultValues: {
            autores: [""]
        }
    });


    const { sigout, errors: SimulacionesErrors, mensaje, setMensaje, setErrors } = UseSimulaciones()
    const { Usuario } = useLogin()
    const [registroExitoso, setRegistroExitoso] = useState(false);
    const { TraerCategoria, Categoria } = UseCategoria()
    const [pasoActual, setPasoActual] = useState(1);
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    const archivoAPK = watch('urlArchivoapk');
    const portada = watch('portada');
    const urlDoc = watch('urlDoc');
    const [materias, setMaterias] = useState([]);
    const camposPaso1 = ['nombre_proyecto', 'autores', 'fechaPublicacion', 'descripcion'];
    const camposPaso2 = ['materia', 'categoriaId', 'youtubeLink'];
    const camposPaso3 = ['urlArchivoapk', 'portada', 'urlDoc'];

    const pasosInfo = [
        { id: 1, titulo: 'Información General', icono: <FileText className="w-5 h-5 mr-2" /> },
        { id: 2, titulo: 'Detalles', icono: <Sliders className="w-5 h-5 mr-2" /> },
        { id: 3, titulo: 'Archivos', icono: <UploadCloud className="w-5 h-5 mr-2" /> },
    ];
    const cargarMaterias = async () => {
        try {
            const res = await GetAllMateria();
            setMaterias(res.data);
        } catch (error) {
            console.error("Error cargando materias", error);
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
            }, 3000); // 3 segundos

            return () => clearTimeout(timer);
        }
    }, [mensaje]);

    useEffect(() => {
        if (SimulacionesErrors.length > 0) {
            const timer = setTimeout(() => {
                // Limpiar errores después de 3 segundos
                setErrors([]);
            }, 8000);

            return () => clearTimeout(timer);
        }
    }, [SimulacionesErrors]);

    const siguientePaso = async () => {
        let camposAValidar = [];
        if (pasoActual === 1) camposAValidar = camposPaso1;
        if (pasoActual === 2) camposAValidar = camposPaso2;

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

    return (
        <div className="flex h-screen bg-gray-100">
            {mensaje && (
                <div className="fixed top-5 right-5 z-50">
                    <Alerta
                        tipo="exito"
                        mensaje={mensaje}
                        onClose={() => setMensaje(null)} />
                </div>
            )}

            {SimulacionesErrors.length > 0 && (
                <div className="fixed top-20 right-5 z-50 space-y-2">
                    {SimulacionesErrors.map((error, i) => (
                        <Alerta key={i} tipo="error" mensaje={error.msg} />
                    ))}
                </div>
            )}

            {/* Menú Lateral */}
            <MenuLateral rol="docente" />

            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                    {/* Indicador de pasos con línea divisoria y subtítulos */}
                    <div className="mb-12">
                        <div className="flex justify-between items-center relative w-full">
                            {/* Línea divisoria */}
                            <div className="absolute left-0 right-0 h-1 bg-gray-300 z-0 top-1/3 mx-6"></div>

                            {pasosInfo.map((paso) => (
                                <React.Fragment key={paso.id}>
                                    {/* Cada paso ocupa el mismo espacio */}
                                    <div className="flex flex-col items-center relative z-10 flex-1">
                                        <span
                                            className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full text-white transition-colors duration-300
                  ${pasoActual === paso.id ? 'bg-blue-600 shadow-md' : 'bg-gray-400'}`}
                                        >
                                            {/* Icono dentro del círculo */}
                                            {React.cloneElement(paso.icono, { className: "w-5 h-5 sm:w-6 sm:h-6" })}
                                        </span>
                                        <div
                                            className={`text-center mt-2 text-xs sm:text-sm whitespace-nowrap
                  ${pasoActual === paso.id ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}
                                        >
                                            {paso.titulo}
                                        </div>
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit(async (data) => {
                            const formData = new FormData();
                            formData.append("nombre_proyecto", data.nombre_proyecto);
                            formData.append("descripcion", data.descripcion);
                            formData.append("autores", data.autores);
                            formData.append("fechaPublicacion", data.fechaPublicacion);
                            formData.append("materia", data.materia);
                            formData.append("Usuario", Usuario.id);
                            formData.append("categoriaId", data.categoriaId);
                            formData.append("youtubeLink", data.youtubeLink || "");


                            if (data.urlArchivoapk && data.urlArchivoapk[0]) {
                                formData.append("urlArchivoapk", data.urlArchivoapk[0]);
                            }
                            if (data.urlDoc && data.urlDoc[0]) {
                                formData.append("urlDoc", data.urlDoc[0]);
                            }
                            if (data.portada && data.portada[0]) {
                                formData.append("portada", data.portada[0]);
                            }

                            formData.append("seccion", "simulaciones");
                            const resultado = await sigout(formData);
                            if (resultado?.success) {
                                setRegistroExitoso(true);
                            }
                        })}
                        className="space-y-6 bg-white p-8 rounded-2xl shadow-xl"
                    >
                        {pasoActual === 1 && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold text-gray-700">Paso 1: Información General</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Nombre de la simulación</label>
                                        <input
                                            {...register('nombre_proyecto', { required: true })}
                                            type="text"
                                            placeholder="Ejemplo: Fuerzas Electromagneticas"
                                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        {errors.nombre_proyecto && (
                                            <p className="mt-1 text-red-500 text-sm">El nombre es requerido</p>
                                        )}
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
                                                        onClick={() => {
                                                            const currentAutores = [...watch('autores')];
                                                            currentAutores.splice(index, 1);
                                                            reset({ ...watch(), autores: currentAutores });
                                                        }}
                                                        className="text-gray-500 hover:text-red-600 transition-colors"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
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
                                            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                                            Añadir autor
                                        </button>
                                        {errors.autores && (
                                            <p className="mt-1 text-red-500 text-sm">Se requiere al menos un autor</p>
                                        )}
                                    </div>

                                    {/* Descripción a la izquierda */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Descripción</label>
                                        <textarea
                                            {...register('descripcion', { required: true })}
                                            rows="4"
                                            placeholder="Una breve descripción de lo que trata la aplicación"
                                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        {errors.descripcion && (
                                            <p className="mt-1 text-red-500 text-sm">Descripción es requerida</p>
                                        )}
                                    </div>

                                    {/* Fecha a la derecha */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Fecha de realización</label>
                                        <input
                                            {...register('fechaPublicacion', { required: true })}
                                            type="datetime-local"
                                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        {errors.fechaPublicacion && (
                                            <p className="mt-1 text-red-500 text-sm">La fecha es requerida</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {pasoActual === 2 && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Materia */}
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

                                    {/* Categoría */}
                                    <div>
                                        <label className="block text-base font-semibold text-gray-800 mb-1">Categoría</label>
                                        <select
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
                                        {errors.categoriaId && (
                                            <p className="mt-1 text-red-500 text-sm">Categoria es requerida</p>
                                        )}
                                    </div>
                                </div>

                                {/* Link YouTube */}
                                <div>
                                    <label className="block text-base font-semibold text-gray-800 mb-1">Link de YouTube</label>
                                    <input
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
                                        <p className="text-red-500 font-semibold text-sm">{errors.youtubeLink.message}</p>
                                    )}
                                </div>
                            </>
                        )}

                        {pasoActual === 3 && (
                            <div className="space-y-4">
                                <h3 className="text-base font-semibold text-gray-800">Cargar Archivos</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">

                                    {/* Subir APK */}
                                    <label className="flex flex-col items-center justify-center w-full max-w-[220px] aspect-square border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept=".apk"
                                            {...register('urlArchivoapk', {
                                                required: 'Se requiere una APK',
                                                validate: {
                                                    tamaño: (archivos) => archivos?.[0]?.size <= MAX_SIZE || 'El archivo supera los 10MB',
                                                    tipo: (archivos) => archivos?.[0]?.name.toLowerCase().endsWith('.apk') || 'El archivo debe ser .apk',
                                                },
                                            })}
                                        />
                                        {archivoAPK?.[0] && (
                                            <span className="text-center text-sm text-gray-700 mt-1 break-words w-full px-2 max-w-[220px]">
                                                {archivoAPK[0].name}
                                            </span>
                                        )}
                                        {archivoAPK?.length > 0 && !errors.urlArchivoapk && (
                                            <p className="text-green-500 text-center font-semibold text-sm">APK subida correctamente</p>
                                        )}
                                        {errors.urlArchivoapk && (
                                            <p className="text-red-500 text-center font-semibold text-sm">{errors.urlArchivoapk.message}</p>
                                        )}
                                        {!archivoAPK?.[0] && <UploadIcon className="w-5 h-5 text-black" />}
                                        {!archivoAPK?.[0] && <span className="text-sm text-gray-600 mt-1">Subir APK</span>}
                                    </label>

                                    {/* Subir PDF */}
                                    <label className="flex flex-col items-center justify-center w-full max-w-[220px] aspect-square border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept=".pdf"
                                            {...register('urlDoc', {
                                                required: 'Se requiere un documento',
                                                validate: {
                                                    tamaño: (archivos) => archivos?.[0]?.size <= MAX_SIZE || 'El documento es muy pesado',
                                                    tipo: (archivos) => archivos?.[0]?.name?.toLowerCase().endsWith('.pdf') || 'El archivo debe ser un PDF',
                                                },
                                            })}
                                        />
                                        {urlDoc?.[0] && (
                                            <span className="text-sm text-center text-gray-700 mt-1 break-words w-full px-2 max-w-[220px]">
                                                {urlDoc[0].name}
                                            </span>
                                        )}
                                        {urlDoc?.length > 0 && !errors.urlDoc && (
                                            <p className="text-green-500 text-center font-semibold text-sm">Documento subido correctamente</p>
                                        )}
                                        {errors.urlDoc && (
                                            <p className="text-red-500 text-center font-semibold text-sm">{errors.urlDoc.message}</p>
                                        )}
                                        {!urlDoc?.[0] && <FileUp className="w-5 h-5 text-black" />}
                                        {!urlDoc?.[0] && <span className="text-sm text-gray-600 mt-1">Subir PDF</span>}
                                    </label>

                                    {/* Subir Imagen */}
                                    <label className="flex flex-col items-center justify-center w-full max-w-[220px] aspect-square border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            {...register('portada', {
                                                required: 'Se requiere una imagen',
                                                validate: {
                                                    tamaño: (archivos) => archivos?.[0]?.size <= MAX_SIZE || 'La imagen supera los 10MB',
                                                    tipo: (archivos) => /\.(jpg|jpeg|png|webp)$/i.test(archivos?.[0]?.name) || 'El archivo debe ser una imagen (.jpg, .jpeg, .png, .webp)',
                                                },
                                            })}
                                        />
                                        {portada?.[0] && (
                                            <span className="text-sm text-center text-gray-700 mt-1 break-words w-full px-2 max-w-[220px]">
                                                {portada[0].name}
                                            </span>
                                        )}
                                        {portada?.length > 0 && !errors.portada && (
                                            <p className="text-green-500 text-center font-semibold text-sm">Imagen subida correctamente</p>
                                        )}
                                        {errors.portada && (
                                            <p className="text-red-500 text-center font-semibold text-sm">{errors.portada.message}</p>
                                        )}
                                        {!portada?.[0] && <Image className="w-5 h-5 text-black" />}
                                        {!portada?.[0] && <span className="text-sm text-gray-600 mt-1">Subir IMG</span>}
                                    </label>

                                </div>
                            </div>
                        )}


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
                                    Subir simulación
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </main >
        </div >
    );
};

export default SubirAPK;