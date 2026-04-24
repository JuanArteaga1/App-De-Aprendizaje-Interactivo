import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import MenuLateral from "../components/MenuAdmi_Doc";

function ActualizarProyecto() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Estado inicial con datos de ejemplo (deberías obtenerlos de tu API)
  const [proyecto, setProyecto] = useState({
    nombre: "Proyecto Ejemplo",
    descripcion: "Descripción inicial",
    autores: "Autor Principal",
    fecha: "2024-03-01",
    categoria: "software",
  });

  const [archivos, setArchivos] = useState({
    apk: null,
    documentos: null,
    avance: null,
    imagenes: [],
  });

  // Simular carga de datos al montar el componente
  useEffect(() => {
    // Aquí deberías hacer una llamada a la API para obtener los datos del proyecto
    console.log("Cargando datos del proyecto:", id);
  }, [id]);

  const handleChange = (e) => {
    setProyecto({ ...proyecto, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e, tipo) => {
    const files = e.target.files;
    if (files.length > 0) {
      if (tipo === "imagenes") {
        setArchivos({
          ...archivos,
          imagenes: [...archivos.imagenes, files[0]],
        });
      } else {
        setArchivos({
          ...archivos,
          [tipo]: files[0],
        });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !proyecto.nombre ||
      !proyecto.descripcion ||
      !proyecto.autores ||
      !proyecto.fecha ||
      !proyecto.categoria
    ) {
      alert("Por favor, complete todos los campos requeridos.");
      return;
    }
    
    // Aquí iría la lógica para actualizar el proyecto en la API
    console.log("Proyecto actualizado:", proyecto);
    console.log("Archivos actualizados:", archivos);
    alert("Proyecto actualizado exitosamente");
    navigate("/mis-proyectos");
  };

  const eliminarArchivo = (tipo, index) => {
    if (tipo === "imagenes") {
      setArchivos({
        ...archivos,
        imagenes: archivos.imagenes.filter((_, i) => i !== index)
      });
    } else {
      setArchivos({
        ...archivos,
        [tipo]: null
      });
    }
  };

  return (
    <>
      <Navbar loggedIn={true} />
      <div className="flex h-screen bg-gray-100">
        <MenuLateral rol="docente" />
        
        <div className="flex-1 p-8 ml-64">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Actualizar Proyecto</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del proyecto</label>
                  <input
                    type="text"
                    name="nombre"
                    value={proyecto.nombre}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Autores</label>
                  <input
                    type="text"
                    name="autores"
                    value={proyecto.autores}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de actualización</label>
                  <input
                    type="date"
                    name="fecha"
                    value={proyecto.fecha}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <select
                    name="categoria"
                    value={proyecto.categoria}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="software">Física</option>
                    <option value="hardware">Cálculo</option>
                    <option value="investigacion">Investigación</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción actualizada</label>
                  <textarea
                    name="descripcion"
                    value={proyecto.descripcion}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Archivos Actualizados</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors relative">
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload(e, "apk")}
                      className="hidden"
                    />
                    <span className="text-3xl">📦</span>
                    <span className="text-sm text-gray-600 mt-1">Actualizar APK</span>
                    {archivos.apk && (
                      <div className="absolute bottom-1 text-xs bg-blue-100 px-2 py-1 rounded">
                        {archivos.apk.name}
                        <button
                          type="button"
                          onClick={() => eliminarArchivo("apk")}
                          className="ml-2 text-red-500"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </label>

                  <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors relative">
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload(e, "avance")}
                      className="hidden"
                    />
                    <span className="text-3xl">📊</span>
                    <span className="text-sm text-gray-600 mt-1">Actualizar Avance</span>
                    {archivos.avance && (
                      <div className="absolute bottom-1 text-xs bg-blue-100 px-2 py-1 rounded">
                        {archivos.avance.name}
                        <button
                          type="button"
                          onClick={() => eliminarArchivo("avance")}
                          className="ml-2 text-red-500"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </label>

                  <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors relative">
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload(e, "imagenes")}
                      className="hidden"
                      multiple
                    />
                    <span className="text-3xl">🖼️</span>
                    <span className="text-sm text-gray-600 mt-1">Agregar Imágenes</span>
                  </label>
                </div>

                {archivos.imagenes.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Vista previa de imágenes:</h4>
                    <div className="flex flex-wrap gap-4">
                      {archivos.imagenes.map((file, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Imagen ${index + 1}`}
                            className="w-32 h-32 object-cover rounded-lg shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() => eliminarArchivo("imagenes", index)}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ActualizarProyecto;