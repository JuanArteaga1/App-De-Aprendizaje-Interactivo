import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const QuienesSomos = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar Simplificada */}
      <Navbar />
      
      {/* Contenedor Principal */}
      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row">
        {/* Sidebar izquierdo  Menú */}
        <div className="lg:w-1/4 mb-8 lg:mb-0 lg:pr-8">
              
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-4">Menú</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => navigate("/")}
                  className="text-gray-700 hover:text-blue-600"
                >
                  Inicio
                </button>
              </li>
              <li className="font-bold text-blue-600 border-l-4 border-blue-600 pl-2">
                Quiénes somos
              </li>
            </ul>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="lg:w-3/4 bg-white p-6 rounded-lg shadow">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">¿Quiénes somos?</h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-6">
              Somos una universidad comprometida con la educación, la investigación y el desarrollo
              de nuestra comunidad académica. Con una tradición de excelencia, buscamos transformar la
              educación superior en Colombia.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Nuestra Historia</h2>
            <p className="text-gray-700 mb-6">
              Texto aquí
            </p>
            
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="md:w-1/2">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Misión</h3>
                <p className="text-gray-700">
                  Texto aquí
                </p>
              </div>
              <div className="md:w-1/2">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Visión</h3>
                <p className="text-gray-700">
                  Texto aquí
                </p>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuienesSomos;