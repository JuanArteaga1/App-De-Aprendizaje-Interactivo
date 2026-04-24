import React, { useState } from "react";
import { Link } from "react-router-dom";

const TablaDocente = () => {
    // Datos de ejemplo (deberías reemplazarlos con tus datos reales)
    const proyectos = [
        { id: 1, nombre: "Proyecto 1", descripcion: "Descripción del proyecto 1" },
        { id: 2, nombre: "Proyecto 2", descripcion: "Descripción del proyecto 2" },
    ];

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Encabezado de la sección */}
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">ADMINISTRATIVOS</h2>
            </div>

            {/* Tabla de proyectos */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                                #
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                NOMBRE
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                DESCRIPCIÓN
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                                ACCIONES
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {proyectos.map((proyecto) => (
                            <tr key={proyecto.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {proyecto.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                    {proyecto.nombre}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 max-w-md">
                                    {proyecto.descripcion}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right space-x-2">
                                    <button className="text-blue-600 hover:text-blue-900 hover:underline">
                                        Actualizar
                                    </button>
                                    <button className="text-red-600 hover:text-red-900 hover:underline">
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pie de tabla con paginación */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                    Mostrando 1 a {proyectos.length} de {proyectos.length} resultados
                </div>
                <div className="flex space-x-2">
                    <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50" disabled>
                        Anterior
                    </button>
                    <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50" disabled>
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TablaDocente;