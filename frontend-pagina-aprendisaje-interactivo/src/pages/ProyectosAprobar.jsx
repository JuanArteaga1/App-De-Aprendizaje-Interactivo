import React, { useState } from "react";
import TablaDinamica from "../components/Tabla";
import MenuAdministrador from "../components/MenuAdmi_Doc";
import { Link } from "react-router-dom";
import { notifySuccess, notifyWarning } from "../lib/notify";

const ProyectosPorAprobar = () => {
  // Datos de ejemplo para proyectos pendientes
  const [proyectos, setProyectos] = useState([
    { 
      id: 1, 
      nombre: "Sistema de Gestión Escolar", 
      tipo: "Simulaciones",
      fecha: "2025-04-3",
      docente: "Cristian Cañar",
      estado: "Pendiente",
      prioridad: "Alta"
    },
    { 
      id: 2, 
      nombre: "App Móvil para Clínica", 
      tipo: "Aplicación Móvil",
      fecha: "2025-04-3",
      docente: "Ana María Caviedes",
      estado: "Pendiente",
      prioridad: "Media"
    },
    { 
      id: 3, 
      nombre: "Plataforma de Podcast", 
      tipo: "Podcast",
      fecha: "2025-04-3",
      docente: "Valentina Urbano",
      estado: "Pendiente",
      prioridad: "Baja"
    },
    { 
      id: 4, 
      nombre: "Plataforma de Investigaciones", 
      tipo: "Investigacion",
      fecha: "2025-04-3",
      docente: "Kevin Ruiz",
      estado: "Pendiente",
      prioridad: "Baja"
    }
  ]);

  // Estados para filtros
  const [busqueda, setBusqueda] = useState("");
  const [filtroPrioridad, setFiltroPrioridad] = useState("");

  // Filtrar proyectos pendientes
  const proyectosFiltrados = proyectos.filter(proyecto => {
    const coincideBusqueda = proyecto.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
                          proyecto.docente.toLowerCase().includes(busqueda.toLowerCase());
    const coincidePrioridad = filtroPrioridad ? proyecto.prioridad === filtroPrioridad : true;
    return coincideBusqueda && coincidePrioridad;
  });

  // Funciones de acciones
  const handleAprobar = (proyecto) => {
    if (window.confirm(`¿Aprobar el proyecto "${proyecto.nombre}"?`)) {
      setProyectos(proyectos.filter((p) => p.id !== proyecto.id));
      notifySuccess("Proyecto aprobado", `${proyecto.nombre} quedó marcado como aprobado.`);
    }
  };

  const handleRechazar = (proyecto) => {
    if (window.confirm(`¿Rechazar el proyecto "${proyecto.nombre}"?`)) {
      setProyectos(proyectos.filter((p) => p.id !== proyecto.id));
      notifyWarning("Proyecto rechazado", `${proyecto.nombre} se retiró de la lista pendiente.`);
    }
  };

  const handleVerDetalles = (proyecto) => {
    console.log('Ver detalles:', proyecto);
    // Navegar a página de detalles
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Menú Lateral */}
      <div className="w-64 bg-gray-800 text-white">
        <MenuAdministrador rol="admin" />
      </div>
      
      {/* Contenido Principal */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 lg:p-8">
          {/* Encabezado */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Proyectos por Aprobar</h1>
            <div className="flex space-x-4">
            </div>
          </div>
          
          {/* Filtros */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="busqueda" className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
                <input
                  id="busqueda"
                  type="text"
                  placeholder="Nombre o docente..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="prioridad" className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
                <select 
                  id="prioridad"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={filtroPrioridad}
                  onChange={(e) => setFiltroPrioridad(e.target.value)}
                >
                  <option value="">Todas las prioridades</option>
                  <option value="Alta">Alta</option>
                  <option value="Media">Media</option>
                  <option value="Baja">Baja</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Tabla de Proyectos Pendientes */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <TablaDinamica
              datos={proyectosFiltrados}
              columnas={[
                { 
                  key: 'id', 
                  nombre: '#', 
                  className: 'w-12 text-center text-sm' 
                },
                { 
                  key: 'nombre', 
                  nombre: 'NOMBRE DEL PROYECTO', 
                  className: 'text-sm' 
                },
                { 
                  key: 'tipo', 
                  nombre: 'TIPO', 
                  className: 'text-sm' 
                },
                { 
                  key: 'docente', 
                  nombre: 'DOCENTE', 
                  className: 'text-sm' 
                },
                { 
                  key: 'fecha', 
                  nombre: 'FECHA', 
                  className: 'text-sm',
                  formateador: (fecha) => new Date(fecha).toLocaleDateString()
                }
              ]}
              acciones={[
                { 
                  nombre: 'Detalles', 
                  fn: handleVerDetalles,
                  estilo: 'bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1'
                },
                { 
                  nombre: 'Aprobar', 
                  fn: handleAprobar,
                  estilo: 'bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1'
                },
                { 
                  nombre: 'Rechazar', 
                  fn: handleRechazar,
                  estilo: 'bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1'
                }
              ]}
            />
          </div>
          
          {/* Pie de tabla */}
          <div className="mt-4 text-sm text-gray-600 flex justify-between items-center">
            <p>Mostrando {proyectosFiltrados.length} de {proyectos.length} proyectos pendientes</p>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border rounded text-sm hover:bg-gray-100">Anterior</button>
              <span className="text-sm">Página 1 de 1</span>
              <button className="px-3 py-1 border rounded text-sm hover:bg-gray-100">Siguiente</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProyectosPorAprobar;