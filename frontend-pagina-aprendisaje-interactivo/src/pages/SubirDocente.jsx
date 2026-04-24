import React, { useState } from "react";
import MenuLateral from "../components/MenuAdmi_Doc";
import Alerta from "../components/AlertasDocente";
import { useForm } from "react-hook-form";
import { UseRegistro } from "../context/RegristroContext";

const SubirDocente = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const { RegistroDocentes, errors: RegistroErrors = [], mensaje } = UseRegistro();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (values) => {
        setIsLoading(true);
        try {
            await RegistroDocentes({ email: values.email });
            // El reset lo puedes hacer aquí si quieres limpiar el formulario siempre
            // reset();
        } catch (error) {
            console.error("Error al enviar:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 bg-gray-900 text-white shadow-lg">
                <MenuLateral rol="admin" />
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4 md:p-6 overflow-auto">
                <div className="w-full max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                            Registro de Usuario
                        </h1>
                        <p className="text-gray-600 text-sm md:text-base">
                            Envía una invitación por correo electrónico para registrar un nuevo docente
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200">
                        {/* Alerts */}
                        <div className="space-y-3 mb-6">
                            {Array.isArray(RegistroErrors) && RegistroErrors.map((error, i) => (
                                <Alerta key={i} tipo="error" mensaje={error.msg} />
                            ))}
                            {mensaje && (
                                <Alerta tipo="exito" mensaje={mensaje} />
                            )}
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Correo Institucional
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    </div>
                                    <input
                                        type="email"
                                        {...register('email', {
                                            required: "El correo electrónico es obligatorio",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Ingresa un correo electrónico válido"
                                            }
                                        })}
                                        className={`w-full pl-10 pr-4 py-3 text-sm border rounded-lg transition-all duration-200 
                                            ${errors.email
                                                ? 'border-red-300 focus:ring-red-200 focus:border-red-500'
                                                : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                                            } 
                                            focus:outline-none focus:ring-2`}
                                        placeholder="profesor@institucion.edu.co"
                                        disabled={isLoading}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-red-500 text-sm flex items-center mt-1">
                                        <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                                <div className="text-sm text-gray-500">
                                    Se enviará un correo con instrucciones de registro
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`px-6 py-3 text-sm font-medium text-white rounded-lg transition-all duration-200 flex items-center space-x-2
                                        ${isLoading
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md transform hover:-translate-y-0.5'
                                        }`}
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Enviando...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                            <span>Enviar Invitación</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Help Section */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-start">
                            <svg className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <h3 className="text-sm font-medium text-blue-800 mb-1">
                                    ¿Cómo funciona?
                                </h3>
                                <p className="text-sm text-blue-700">
                                    Al enviar este formulario, se generará un correo de invitación que incluirá un enlace
                                    seguro para que el docente pueda completar su registro en la plataforma.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubirDocente;