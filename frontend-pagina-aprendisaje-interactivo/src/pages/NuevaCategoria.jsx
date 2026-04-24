// Añadir categoria 
import React, { useEffect, useState } from "react";
import { Outlet } from 'react-router-dom';
import MenuDocente from "../components/MenuAdmi_Doc";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";


import { UseCategoria } from "../context/CategoriaContext";
import Alerta from "../components/AlertasDocente";
function NuevaCategoria() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch
    } = useForm({
        defaultValues: {
            estado: 'activa'
        }
    });
    const { sigout, errors: CategoriaErrors, mensaje } = UseCategoria()
    const [enviando, setEnviando] = useState(false);
    const [registroExitoso, setRegistroExitoso] = useState(false);
    const [exito, setExito] = useState(false);
      const navigate = useNavigate()
      const location = useLocation();
      
const [tipoMensaje, setTipoMensaje] = useState("success");
    

    // Para el contador de caracteres en descripción
    const descripcion = watch('descripcion', '');

    const onSubmit = async (data) => {
        const resultado = await sigout(data);
        if (resultado?.success) {
            setRegistroExitoso(true);

        }

    };

    useEffect(() => {
        if (location.state?.registroExitoso) {
            setMensaje(location.state.registroExitoso);
            setTipoMensaje(location.state.tipo || "success");

            setTimeout(() => {
                setRegistroExitoso(false);
                navigate(location.pathname, { replace: true });
            }, 3000);
        }
    }, [location.state, navigate, location.pathname]);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Menú Lateral */}            
            <MenuDocente rol="admin" />            
            {/* Contenido Principal */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="flex flex-col items-center pt-10">
                    <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-2xl">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Añadir Nueva Categoría</h2>

                        {exito && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-center">¡Categoría creada exitosamente!</div>}
                        {CategoriaErrors.map((error, i) => (
                            <Alerta key={i} tipo="error" mensaje={error.msg} />
                        ))}
                        {mensaje && (<Alerta tipo="exito" mensaje={mensaje} />
                        )}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {/* Campo Nombre */}
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1">
                                    Nombre de la categoría *
                                </label>
                                <input
                                    type="text"
                                    {...register('Nombre_Categoria', {
                                        required: 'El nombre es requerido',
                                        maxLength: {
                                            value: 50,
                                            message: 'Máximo 50 caracteres'
                                        }
                                    })}
                                    className={`w-full px-3 py-2 border rounded-md ${errors.nombre ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Ej: Aplicaciones Móviles"
                                />
                                {errors.nombre && (
                                    <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
                                )}
                            </div>

                            {/* Campo Descripción */}
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1">
                                    Descripción
                                </label>
                                <textarea
                                    {...register('Descripcion', {
                                        maxLength: {
                                            value: 200,
                                            message: 'Máximo 200 caracteres'
                                        }
                                    })}
                                    rows="3"
                                    className={`w-full px-3 py-2 border rounded-md ${errors.descripcion ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Breve descripción de la categoría"
                                />
                                {errors.descripcion && (
                                    <p className="mt-1 text-sm text-red-600">{errors.descripcion.message}</p>
                                )}
                                <p className="text-xs text-gray-500">{descripcion.length}/200</p>
                            </div>

                            {/* Campo Estado */}
                            <div>
                            </div>

                            {/* Botón de Guardar */}
                            <div className="flex justify-center pt-4">
                                <button
                                    type="submit"
                                    disabled={enviando}
                                    className={`px-6 py-2 rounded-md text-white font-medium w-full max-w-xs ${enviando ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                                >
                                    {enviando ? 'Guardando...' : 'Guardar Categoría'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NuevaCategoria;