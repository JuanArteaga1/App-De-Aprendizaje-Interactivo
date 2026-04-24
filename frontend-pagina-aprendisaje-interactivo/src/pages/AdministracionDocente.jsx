import React, { useEffect, useState } from "react";
// Importamos los iconos necesarios para un diseño profesional
import { UserPlus, Users, Trash2, CheckCircle, Clock, MessageSquare } from 'lucide-react'; 

// Componentes y Contexto (Sin Modificar)
import TablaDinamica from "../components/Tabla";
import MenuAdministrador from "../components/MenuAdmi_Doc";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UseDocente } from "../context/DocenteContext";
import Swal from 'sweetalert2';

const AdministrarDocente = () => {
  const { EliminarSolicitud, Docente, TraerDocentes, EliminarDocentes, Solicitudes, TraerSolicitudes } = UseDocente();
  const [columnas, setColumnas] = useState([]);
  const [columnasSolicitudes, setColumnasSolicitudes] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [tipoMensaje, setTipoMensaje] = useState("success");
  const [mensaje, setMensaje] = useState(null);
  const [railColapsado, setRailColapsado] = useState(false);

    useEffect(() => {
        TraerDocentes();
        TraerSolicitudes && TraerSolicitudes(); // si existe en el contexto
    }, []);

    useEffect(() => {
        setColumnas([
            { key: 'nombre', nombre: 'Nombre' },
            { key: 'identificacion', nombre: 'Identificación' },
            { key: 'email', nombre: 'Correo' },
        ]);

        setColumnasSolicitudes([
            { key: "email", nombre: "Correo" },
            { key: "createdAt", nombre: "Fecha de Solicitud" }, // Renombramos 'Fecha de Creación'
            { key: "activation_expires", nombre: "Expiración / Estado" },
        ]);
    }, []);

  const acciones = [
    {
      nombre: "Eliminar",
      fn: (fila) => {
        Swal.fire({
          title: '¿Estás seguro?',
          text: `Esta acción eliminará al docente "${fila.NombreCompleto || fila.nombre}"`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#ef4444',
          cancelButtonColor: '#6b7280',
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar',
          customClass: {
            popup: 'rounded-xl shadow-xl'
          }
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              await EliminarDocentes(fila._id);
              Swal.fire('¡Eliminado!', 'El docente ha sido eliminado.', 'success');
              TraerDocentes();
            } catch (error) {
              console.error(error);
              Swal.fire('Error', 'Hubo un problema al eliminar el docente.', 'error');
            }
                    }
                });
            },
            // Estilo de botón de acción: sutil y con icono
            estilo: "text-red-500 hover:text-red-700 p-1 rounded-full transition-colors" 
        }
    ];

    useEffect(() => {
        if (location.state?.mensaje) {
            setMensaje(location.state.mensaje);
            setTipoMensaje(location.state.tipo || "success");

            setTimeout(() => {
                setMensaje(null);
                navigate(location.pathname, { replace: true });
            }, 3000);
        }
    }, [location.state, navigate, location.pathname]);

    // --- Diseño Mejorado ---
    return (
        <div className="flex min-h-[100dvh] bg-gray-50 font-sans">
            <aside className="fixed inset-y-0 left-0 z-20 h-[100dvh] max-h-[100dvh]">
              <MenuAdministrador
                rol="admin"
                colapsado={railColapsado}
                setColapsado={setRailColapsado}
              />
            </aside>

            {/* Contenido Principal con overflow-y-auto */}
            <main className={`flex-1 overflow-y-auto p-6 md:p-10 ${railColapsado ? "pl-20 lg:pl-24" : "pl-[18.5rem] lg:pl-[19rem]"}`}>
                <div className="max-w-7xl mx-auto">

                    {/* HEADER DE SECCIÓN (Estilo Comentarios) */}
                    <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                                Administración de Usuarios
                            </h1>
                            <p className="text-gray-500 mt-1 text-sm md:text-base pl-14">
                                Gestiona los docentes y revisa las solicitudes de acceso al sistema.
                            </p>
                        </div>
                        
                        {/* Botón de acción principal */}
                        <Link
                            to="/SubirDocente"
                            className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-all duration-300 transform hover:scale-[1.02] text-sm md:text-base"
                        >
                            <UserPlus className="w-5 h-5 mr-2" />
                            Registrar Nuevo Docente
                        </Link>
                    </div>

                    {/* NOTIFICACIÓN (Estilo Comentarios) */}
                    {mensaje && (
                        <div className={`mb-6 p-4 rounded-xl shadow-md flex items-center transition-opacity duration-500 ${
                            tipoMensaje === "success"
                                ? "bg-green-100 text-green-800 border border-green-300"
                                : "bg-red-100 text-red-800 border border-red-300"
                        }`}>
                            <MessageSquare className="w-5 h-5 mr-3"/>
                            <span className="font-medium">{mensaje}</span>
                        </div>
                    )}

                    {/* --- CARD DE DOCENTES ACTIVOS --- */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-10">
                        <div className="p-6 border-b border-gray-200 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600"/>
                            <h2 className="text-xl font-bold text-gray-800">Docentes Registrados</h2>
                        </div>
                        
                        <div className="p-6">
                            <TablaDinamica
                                datos={Docente}
                                columnas={columnas}
                                acciones={acciones.map(a => ({
                                    ...a,
                                    // Renderizar botón con icono y estilo limpio
                                    componente: (fila, fn) => (
                                        <button 
                                            onClick={() => fn(fila)}
                                            className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-all"
                                            title="Eliminar Docente"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    )
                                }))}
                                // Clases de estilo para la tabla
                            />
                        </div>
                    </div>

                    {/* --- CARD DE SOLICITUDES PENDIENTES --- */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-200 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-amber-500"/>
                            <h2 className="text-xl font-bold text-gray-800">Solicitudes Pendientes</h2>
                        </div>

                        <div className="p-6">
                            <TablaDinamica
                                datos={Solicitudes}
                                columnas={columnasSolicitudes}
                                acciones={[
                                    {
                                        nombre: "Eliminar",
                                        fn: (fila) => {
                                            Swal.fire({
                                                title: '¿Estás seguro?',
                                                text: `Esta acción eliminará la solicitud de "${fila.email}"`,
                                                icon: 'warning',
                                                showCancelButton: true,
                                                confirmButtonColor: '#ef4444',
                                                cancelButtonColor: '#6b7280',
                                                confirmButtonText: 'Sí, eliminar',
                                                cancelButtonText: 'Cancelar',
                                                customClass: {
                                                    popup: 'rounded-xl shadow-xl'
                                                }
                                            }).then(async (result) => {
                                                if (result.isConfirmed) {
                                                    try {
                                                        await EliminarSolicitud(fila.id);
                                                        Swal.fire('¡Eliminada!', 'La solicitud ha sido eliminada.', 'success');
                                                        TraerSolicitudes();
                                                    } catch (error) {
                                                        console.error(error);
                                                        Swal.fire('Error', 'Hubo un problema al eliminar la solicitud.', 'error');
                                                    }
                                                }
                                            });
                                        },
                                        // Renderizar botón con icono
                                        componente: (fila, fn) => (
                                            <button 
                                                onClick={() => fn(fila)}
                                                className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-all"
                                                title="Eliminar Solicitud"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        )
                                    }
                                ]}
                                // Clases de estilo para la tabla
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdministrarDocente;