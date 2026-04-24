import React, { useEffect } from "react";
import MenuLateral from "../components/MenuAdmi_Doc";
import Alerta from "../components/AlertasDocente";
import { FaUserGraduate, FaIdCard, FaEnvelope, FaLock, FaChalkboardTeacher, FaSave } from 'react-icons/fa'
import { useForm } from "react-hook-form";
import { UseDocente } from "../context/DocenteContext";
import { useParams, useNavigate, useLocation } from "react-router-dom";


const EditarDocente = () => {
    const location = useLocation();
    const docente = location.state?.docente;
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const { Docente, EditarDocentes, errors: DocenteErrors, mensaje, TraerDocentes } = UseDocente();
    const { id } = useParams();
    const navigate = useNavigate();


    useEffect(() => {
        
    if (docente) {
        setValue('Nombre', docente.nombre);
        setValue('identificacion', docente.identificacion);
        setValue('Codigo', docente.Codigo);
        setValue('email', docente.email);
        setValue('contrasena', docente.contrasena); // Si decides permitir edición de contraseña
        setValue('rol', docente.rol);
        setValue('estado', docente.estado);
        setValue('funcion', docente.funcion);
    }
}, [docente, setValue]);


    const onSubmit = async (values) => {
        const result = await EditarDocentes(id, values);
        if (result?.success) {
            navigate("/AdministrarDocente", {
                state: {
                    mensaje: "Podcast actualizado correctamente",
                    tipo: "success"
                }
            });
        }
        // Si hay error, se mostrará por DocenteErrors
    };

    return (
        <>
            <div className="flex h-screen bg-gray-100">
                {/* Menú Lateral */}
                <div className="w-64 bg-gray-800 text-white">
                    <MenuLateral rol="admin" />
                </div>
                {/* Contenido principal */}
                <div className="flex-1 p-4 md:p-6 overflow-auto">
                    <div className="w-full max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100 transform origin-top transition-all duration-300">
                        <div className="mb-6 md:mb-8">
                            <div className="flex items-center mb-2">
                                <FaChalkboardTeacher className="text-blue-600 text-2xl md:text-3xl mr-3 flex-shrink-0" />
                                <h2 className="text-xl md:text-2xl font-bold text-gray-800"> EDICION DE USUARIO</h2>
                            </div>
                            <p className="text-green-500 text-xs md:text-sm flex items-center ml-9 md:ml-10">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 flex-shrink-0"></span>
                                Acceso completo
                            </p>
                        </div>

                        {DocenteErrors.map((error, i) => (
                            <Alerta key={i} tipo="error" mensaje={error.msg} />
                        ))}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">

                            {/* Sección 1: Información personal */}
                            <div className="space-y-4 md:space-y-5">
                                <h3 className="text-base md:text-lg font-semibold text-gray-700 border-b pb-2">
                                    Información Personal
                                </h3>

                                {/* Nombre completo */}
                                <div className="relative">
                                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 flex items-center">
                                        <FaUserGraduate className="mr-2 text-blue-500 flex-shrink-0" />
                                        Nombre completo
                                    </label>
                                    <input
                                        type="text"
                                        {...register('Nombre', { required: true })}
                                        className="w-full pl-9 md:pl-10 pr-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                                        placeholder="Ingrese el nombre completo"
                                    />
                                    {errors.Nombre && (<p className="text-red-500">Nombre es requerido</p>)}
                                </div>

                                {/* Identificación */}
                                <div className="relative">
                                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 flex items-center">
                                        <FaIdCard className="mr-2 text-blue-500 flex-shrink-0" />
                                        Número de identificación
                                    </label>
                                    <input
                                        type="text"
                                        {...register('identificacion', { required: true })}
                                        className="w-full pl-9 md:pl-10 pr-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                                        placeholder="Ej: 1234567890"
                                    />
                                    {errors.identificacion && (<p className="text-red-500">identificacion es requerido</p>)}
                                </div>
                            </div>

                            {/* Sección 2: Información institucional */}
                            <div className="space-y-4 md:space-y-5">
                                <h3 className="text-base md:text-lg font-semibold text-gray-700 border-b pb-2">
                                    Información Institucional
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                                    {/* Código del docente */}
                                    <div className="relative">
                                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 flex items-center">
                                            <FaIdCard className="mr-2 text-blue-500 flex-shrink-0" />
                                            Código Usuario
                                        </label>
                                        <input
                                            type="text"
                                            {...register('Codigo', { required: true })}
                                            className="w-full pl-9 md:pl-10 pr-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                                            placeholder="Ej: PROF-001"
                                        />
                                        {errors.Codigo && (<p className="text-red-500">codigo es requerido</p>)}
                                    </div>
                                    {/* Correo institucional */}
                                    <div className="relative">
                                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 flex items-center">
                                            <FaEnvelope className="mr-2 text-blue-500 flex-shrink-0" />
                                            Correo institucional
                                        </label>
                                        <input
                                            type="email"
                                            {...register('email', { required: true })}
                                            className="w-full pl-9 md:pl-10 pr-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                                            required
                                            placeholder="ejemplo@institucion.edu"
                                        />
                                        {errors.email && <p className="text-red-500">email es requerido</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Sección 3: Credenciales */}
                            <div className="space-y-4 md:space-y-5">
                                <h3 className="text-base md:text-lg font-semibold text-gray-700 border-b pb-2">
                                    Credenciales de acceso
                                </h3>

                                <div className="relative">
                                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 flex items-center">
                                        <FaLock className="mr-2 text-blue-500 flex-shrink-0" />
                                        Contraseña
                                    </label>
                                    <input
                                        type="password"
                                        {...register('contrasena', { required: true })}
                                        className="w-full pl-9 md:pl-10 pr-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                                        required
                                        placeholder="••••••••"
                                    />
                                    {errors.contrasena && (<p className="text-red-500">contraseña es requerido</p>)}
                                </div>
                            </div>
                            <select {...register('rol', { required: true })}>
                                <option value="">Selecciona un rol</option>
                                <option value="Docente">Docente</option>
                                <option value="Administrador">Administrador</option>
                            </select>
                            {errors.rol && (<p className="text-red-500">selecciones una opcion</p>)}

                            <select {...register('estado', { required: true })}>
                                <option value="">Selecciona un estado</option>
                                <option value="activo">Activo</option>
                                <option value="inactivo">Inactivo</option>
                            </select>
                            {errors.estado && (<p className="text-red-500">selecciones una opcion</p>)}

                            <input {...register('funcion', { required: true })} placeholder="Función que cumple" />
                            {errors.funcion && (<p className="text-red-500">funcion es requerido</p>)}

                            {/* Botones de acción */}
                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => navigate("/AdministrarDocente")}
                                    className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition duration-200"
                                >
                                    <FaSave />
                                    Guardar cambios
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditarDocente;