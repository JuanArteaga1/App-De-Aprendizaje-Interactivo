import React, { useEffect, useState } from "react";
import MenuLateral from "../components/MenuAdmi_Doc";
import { useForm, useFieldArray } from "react-hook-form";
import { useInvestigacion } from "../context/InvestigacionContext";
import Alerta from "../components/AlertasDocente";
import { useLogin } from "../context/LoginContext";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ImageIcon, UploadIcon, FileText, Sliders, UploadCloud, ArrowRight, ArrowLeft } from "lucide-react";
import { useMateriasFromBackend } from "../hooks/useMateriasFromBackend";

function EditarInvestigacion() {
    const location = useLocation();
    const navigate = useNavigate();
    const investigacion = location.state?.investigacion;
    const { 
        register, 
        handleSubmit, 
        setValue, 
        watch, 
        control,
        trigger,
        formState: { errors } 
    } = useForm({
        defaultValues: {
            autores: [{ nombre: "" }],
        },
    });
    
    const { fields, append, remove } = useFieldArray({ control, name: "autores" });
    const [investigacionActual, setInvestigacionActual] = useState(null);
    const { ActualizarInvestigaciones, errors: InvestigacionErrors } = useInvestigacion();
    const { Usuario } = useLogin();
    const [pasoActual, setPasoActual] = useState(1);
    const MAX_SIZE = 10 * 1024 * 1024;
    const portada = watch("portada");
    const urlDoc = watch("urlDoc");
    const { id } = useParams();
    const materias = useMateriasFromBackend();

    const pasosInfo = [
        { id: 1, titulo: "Información General", icono: <FileText className="w-5 h-5 mr-2" /> },
        { id: 2, titulo: "Detalles", icono: <Sliders className="w-5 h-5 mr-2" /> },
        { id: 3, titulo: "Archivos", icono: <UploadCloud className="w-5 h-5 mr-2" /> },
    ];

    // Validación por pasos
    const camposPaso1 = ["nombre_proyecto", "descripcion", "autores", "fechaPublicacion"];
    const camposPaso2 = ["materia", "urlArticulo", "urlDoi"];
    const camposPaso3 = ["portada", "urlDoc"];

    const siguientePaso = async () => {
        let camposAValidar = [];
        if (pasoActual === 1) camposAValidar = camposPaso1;
        if (pasoActual === 2) camposAValidar = camposPaso2;

        const valido = await trigger(camposAValidar);
        if (valido && pasoActual < pasosInfo.length) setPasoActual(pasoActual + 1);
    };

    const pasoAnterior = () => {
        if (pasoActual > 1) setPasoActual(pasoActual - 1);
    };

    useEffect(() => {
        if (investigacion) {
            setInvestigacionActual(investigacion);
            
            // Convertir autores string a array de objetos
            const autoresArray = investigacion.autores 
                ? investigacion.autores.split(", ").map(nombre => ({ nombre })) 
                : [{ nombre: "" }];
                
            setValue("nombre_proyecto", investigacion.nombre_proyecto);
            setValue("descripcion", investigacion.descripcion);
            setValue("autores", autoresArray);
            setValue("fechaPublicacion", investigacion.fechaPublicacion);
            setValue("materia", investigacion.materia);
            setValue("urlArticulo", investigacion.urlArticulo);
            setValue("urlDoi", investigacion.urlDoi);
        }
    }, [investigacion, setValue]);

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            formData.append("nombre_proyecto", data.nombre_proyecto);
            formData.append("descripcion", data.descripcion);
            formData.append("autores", data.autores.map(a => a.nombre).join(", "));
            formData.append("fechaPublicacion", data.fechaPublicacion);
            formData.append("materia", data.materia);
            formData.append("urlArticulo", data.urlArticulo);
            formData.append("urlDoi", data.urlDoi);
            if (data.portada?.[0]) formData.append("portada", data.portada[0]);
            if (data.urlDoc?.[0]) formData.append("urlDoc", data.urlDoc[0]);
            formData.append("Usuario", Usuario?.Id || "");
            formData.append("seccion", "Investigacion");

            const respuesta = await ActualizarInvestigaciones(id, formData);
            if (respuesta?.success) {
                const ruta = Usuario.Rol === "Docente" ? "/misproyectos" : "/VerProyectos";
                navigate(ruta, {
                    state: {
                        mensaje: "Investigación actualizada correctamente",
                        tipo: "success"
                    }
                });
            }
        } catch (error) {
            console.error("Error al actualizar investigación:", error);
        }
    };

    const handleCancel = () => {
        navigate("/misproyectos");
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Alertas */}
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
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6 bg-white p-8 rounded-2xl shadow-xl"
                    >
                        {/* Paso 1 */}
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
                                                {...register("nombre_proyecto", { required: "El título es obligatorio" })}
                                                type="text"
                                                placeholder="Ejemplo: Investigación sobre energías renovables"
                                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            {errors.nombre_proyecto && (
                                                <p className="mt-1 text-red-500 text-sm">{errors.nombre_proyecto.message}</p>
                                            )}
                                        </div>

                                        {/* Descripción */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Descripción</label>
                                            <textarea
                                                {...register("descripcion", { required: "La descripción es obligatoria" })}
                                                rows="4"
                                                placeholder="Una breve descripción de la investigación"
                                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            {errors.descripcion && (
                                                <p className="mt-1 text-red-500 text-sm">{errors.descripcion.message}</p>
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
                                                        {...register(`autores.${index}.nombre`, { required: "Se requiere al menos un autor" })}
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
                                                {...register("fechaPublicacion", { required: "La fecha es requerida" })}
                                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            {errors.fechaPublicacion && (
                                                <p className="mt-1 text-red-500 text-sm">{errors.fechaPublicacion.message}</p>
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
                                    <label className="block font-semibold text-gray-800">Materia</label>
                                    <select
                                        {...register("materia", { required: "Debe seleccionar una materia" })}
                                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg"
                                    >
                                        <option value="">Seleccionar materia</option>
                                        {materias.map((m) => (
                                            <option key={m._id || m.id} value={m.nombre}>
                                                {m.nombre}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.materia && <p className="text-red-500 text-sm">{errors.materia.message}</p>}
                                </div>

                                <div>
                                    <label className="block font-semibold text-gray-800">URL del Artículo</label>
                                    <input
                                        type="url"
                                        {...register("urlArticulo", { required: "Debe ingresar el enlace del artículo" })}
                                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg"
                                    />
                                    {errors.urlArticulo && <p className="text-red-500 text-sm">{errors.urlArticulo.message}</p>}
                                </div>

                                <div>
                                    <label className="block font-semibold text-gray-800">URL DOI</label>
                                    <input
                                        type="url"
                                        {...register("urlDoi", { required: "Debe ingresar la URL del DOI" })}
                                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg"
                                    />
                                    {errors.urlDoi && <p className="text-red-500 text-sm">{errors.urlDoi.message}</p>}
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
                                            {...register("portada", {
                                                required: portada?.[0] ? false : "Se requiere una imagen",
                                                validate: {
                                                    tamaño: (archivos) => 
                                                        !archivos?.[0] || archivos[0].size <= MAX_SIZE || 'La imagen supera los 10MB',
                                                    tipo: (archivos) =>
                                                        !archivos?.[0] || /\.(jpg|jpeg|png|webp)$/i.test(archivos[0].name) ||
                                                        'El archivo debe ser una imagen (.jpg, .jpeg, .png, .webp)',
                                                },
                                            })}
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
                                            {...register("urlDoc", {
                                                required: urlDoc?.[0] ? false : "Se requiere un documento",
                                                validate: {
                                                    tamaño: (archivos) => 
                                                        !archivos?.[0] || archivos[0].size <= MAX_SIZE || 'El documento es muy pesado',
                                                    tipo: (archivos) =>
                                                        !archivos?.[0] || archivos[0].name.toLowerCase().endsWith('.pdf') || 
                                                        'El archivo debe ser un PDF',
                                                },
                                            })}
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
                                    onClick={handleCancel}
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
                                        Actualizar Investigación
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

export default EditarInvestigacion;