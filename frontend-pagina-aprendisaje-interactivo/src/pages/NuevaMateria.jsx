// NuevaMateria.jsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import MenuDocente from "../components/MenuAdmi_Doc";
import Alerta from "../components/AlertasDocente";

// Importa tu contexto o API de Materia (depende de cómo lo manejes, aquí asumo Context como con Categoría)
import { UseMateria } from "../context/MateriaContext";

function NuevaMateria() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch
    } = useForm({
        defaultValues: {
            Estado: "activa"
        }
    });

    const { sigout, errors: MateriaErrors, mensaje } = UseMateria();
    const [enviando, setEnviando] = useState(false);
    const [registroExitoso, setRegistroExitoso] = useState(false);
    const [exito, setExito] = useState(false);
    const [tipoMensaje, setTipoMensaje] = useState("exito");

    const navigate = useNavigate();
    const location = useLocation();

    // contador caracteres
    const descripcion = watch("Descripcion", "");

    const onSubmit = async (data) => {
        setEnviando(true);
        const resultado = await sigout(data); // aquí llamas a tu acción del context o API
        if (resultado?.success) {
            setRegistroExitoso(true);
            setExito(true);
            reset(); // limpiar formulario
        }
        setEnviando(false);
    };

    useEffect(() => {
        if (location.state?.registroExitoso) {
            setTipoMensaje(location.state.tipo || "exito");

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
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                            Añadir Nueva Materia
                        </h2>

                        {exito && (
                            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-center">
                                ¡Materia creada exitosamente!
                            </div>
                        )}
                        {MateriaErrors.map((error, i) => (
                            <Alerta key={i} tipo="error" mensaje={error.msg} />
                        ))}
                        {mensaje && <Alerta tipo="exito" mensaje={mensaje} />}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {/* Nombre */}
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1">
                                    Nombre de la materia *
                                </label>
                                <input
                                    type="text"
                                    {...register("nombre", {
                                        required: "El nombre es requerido",
                                        maxLength: {
                                            value: 50,
                                            message: "Máximo 50 caracteres"
                                        }
                                    })}
                                    className={`w-full px-3 py-2 border rounded-md ${errors.nombre ? "border-red-500" : "border-gray-300"
                                        }`}
                                    placeholder="Ej: Matemáticas I"
                                />
                                {errors.nombre && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.nombre.message}
                                    </p>
                                )}
                            </div>

                            {/* Botón */}
                            <div className="flex justify-center pt-4">
                                <button
                                    type="submit"
                                    disabled={enviando}
                                    className={`px-6 py-2 rounded-md text-white font-medium w-full max-w-xs ${enviando
                                            ? "bg-blue-400"
                                            : "bg-blue-600 hover:bg-blue-700"
                                        }`}
                                >
                                    {enviando ? "Guardando..." : "Guardar Materia"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NuevaMateria;
