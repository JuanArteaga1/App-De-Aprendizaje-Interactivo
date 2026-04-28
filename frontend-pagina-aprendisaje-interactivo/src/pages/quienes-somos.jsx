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
              La Corporación Universitaria Autónoma del Cauca (Uniautónoma) es una institución de educación superior privada, de utilidad común y sin ánimo de lucro, con sede principal en Popayán, Cauca. Se enfoca en formar líderes, visionarios y emprendedores con alta sensibilidad social, liderazgo cívico y competencia científica
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Nuestra Historia</h2>
            <p className="text-gray-700 mb-6">
              La Corporación Universitaria Autónoma del Cauca es una Institución de Educación Superior ubicada en la ciudad de Popayán. Uno de los valores más destacados de la Institución es su tradición como formadora de Talento Humano calificado. El cultivo y los aprendizajes de la ciencia y la técnica se iniciaron hace más de 40 años con la Corporación UCICA fundada en 1979 y reconocida por Resolución Nº 13002 de 1984, expedida por el Ministerio de Educación Nacional.
            </p>
            
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="md:w-1/2">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Misión</h3>
                <p className="text-gray-700">
                  Formamos líderes con calidad académica, espíritu emprendedor y compromiso social, capaces de transformar positivamente su entorno mediante la innovación, la investigación, el pensamiento crítico y una profunda sensibilidad frente a los desafíos del mundo contemporáneo.
                </p>
              </div>
              <div className="md:w-1/2">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Visión</h3>
                <p className="text-gray-700">
                  Para el año 2025, la Corporación Universitaria Autónoma del Cauca será reconocida en la Región Pacífico de Colombia como una universidad líder en la formación de talento humano con excelencia profesional, ética y cívica, comprometido con la protección de los recursos naturales y el desarrollo sostenible de su entorno.

Para alcanzar esta visión, la Institución orienta su quehacer académico, investigativo, innovador, emprendedor y de proyección social hacia el fortalecimiento del desarrollo integral y sustentable de la región.
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