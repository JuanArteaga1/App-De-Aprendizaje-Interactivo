import React, { useState } from "react";
import Navbar from "../components/Navbar";
import CategoryBox from "../components/CategoryBox";
import { PrevArrow, NextArrow } from "../components/CustomArrows";

const AyudaT = () => {
  const [selectedPerson, setSelectedPerson] = useState(null);

  // Datos del equipo con información de contacto
  const teamMembers = [
    {
      name: 'KEVIN ARMANDO RUIZ MUÑOZ',
      email: 'kevin.ruiz@example.com',
      phone: '+57 300 123 4567',
      role: 'Desarrollador Frontend',
      description: 'Especialista en React y diseño de interfaces de usuario.'
    },
    {
      name: 'ESTIVEN REALPE HORMIGA',
      email: 'estiven.realpe@example.com',
      phone: '+57 301 234 5678',
      role: 'Desarrollador Backend',
      description: 'Experto en bases de datos y arquitectura de sistemas.'
    },
    {
      name: 'JUAN MANUEL ARTEAGA',
      email: 'juan.arteaga@example.com',
      phone: '+57 302 345 6789',
      role: 'Analista de Sistemas',
      description: 'Especializado en análisis de requerimientos y documentación.'
    },
    {
      name: 'DIANA MARCELA SANCHEZ OROZCO',
      email: 'diana.sanchez@example.com',
      phone: '+57 303 456 7890',
      role: 'Diseñadora UX/UI',
      description: 'Enfocada en experiencia de usuario y diseño visual.'
    },
    {
      name: 'VALENTINA URBANO BENITEZ',
      email: 'valentina.urbano@example.com',
      phone: '+57 304 567 8901',
      role: 'Project Manager',
      description: 'Coordinación de proyectos y gestión de equipos.'
    }
  ];

  const handlePersonClick = (person) => {
    setSelectedPerson(selectedPerson?.name === person.name ? null : person);
  };

  return (
    <div className="w-full overflow-x-hidden bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <Navbar />

      <section className="flex flex-col items-center px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-12 text-center">
          Creadores de la Página
        </h1>

        <div className="flex flex-col md:flex-row gap-10 items-center max-w-6xl w-full">
          {/* Imagen */}
          <div className="w-full md:w-1/2">
            <img
              src="/img/grupo.JPG"
              alt="Equipo de Desarrollo"
              className="rounded-3xl shadow-xl w-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Texto + Equipo */}
          <div className="w-full md:w-1/2 flex flex-col justify-center space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              Somos un equipo apasionado por la tecnología y el aprendizaje. Nuestro objetivo es crear herramientas interactivas que faciliten el acceso a la información y el conocimiento de forma divertida e intuitiva.
            </p>

            <div className="bg-white bg-opacity-90 p-6 rounded-2xl shadow-md border border-gray-200">
              <h2 className="text-2xl font-bold text-blue-700 text-center mb-4">
                Equipo de Desarrollo
              </h2>
              <p className="text-sm text-gray-500 text-center mb-4">
                Haz clic en cualquier nombre para ver la información de contacto
              </p>
              
              <div className="space-y-3">
                {teamMembers.map((person) => (
                  <div 
                    key={person.name} 
                    onClick={() => handlePersonClick(person)}
                    className={`
                      relative overflow-hidden rounded-xl cursor-pointer border-2 transition-all duration-500 ease-in-out transform
                      ${selectedPerson?.name === person.name 
                        ? 'border-blue-400 shadow-lg scale-105 bg-gradient-to-r from-blue-50 to-indigo-50' 
                        : 'border-gray-200 hover:border-blue-300 hover:shadow-md hover:scale-102 bg-white'
                      }
                    `}
                    style={{ minHeight: selectedPerson?.name === person.name ? '280px' : '60px' }}
                  >
                    {/* Vista de nombre */}
                    <div className={`
                      absolute inset-0 transition-all duration-500 ease-in-out
                      ${selectedPerson?.name === person.name 
                        ? 'opacity-0 transform -translate-y-4 pointer-events-none' 
                        : 'opacity-100 transform translate-y-0'
                      }
                    `}>
                      <div className="p-4 flex items-center justify-between h-full">
                        <span className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">
                          🔹 {person.name}
                        </span>
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-500 text-xs">▶</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Vista de información de contacto */}
                    <div className={`
                      absolute inset-0 transition-all duration-500 ease-in-out
                      ${selectedPerson?.name === person.name 
                        ? 'opacity-100 transform translate-y-0' 
                        : 'opacity-0 transform translate-y-4 pointer-events-none'
                      }
                    `}>
                      <div className="p-5 h-full">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-blue-800 truncate">
                            {person.name}
                          </h3>
                          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                            <span className="text-white text-xs">▼</span>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 text-sm">👨‍💼</span>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Rol</p>
                              <p className="text-gray-800 font-medium">{person.role}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600 text-sm">📧</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                              <a 
                                href={`mailto:${person.email}`}
                                className="text-blue-600 hover:text-blue-800 hover:underline text-sm truncate block"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {person.email}
                              </a>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-purple-600 text-sm">📱</span>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Teléfono</p>
                              <a 
                                href={`tel:${person.phone}`}
                                className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {person.phone}
                              </a>
                            </div>
                          </div>
                          
                          <div className="mt-4 p-3 bg-white bg-opacity-60 rounded-lg">
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Descripción</p>
                            <p className="text-gray-700 text-sm leading-relaxed">{person.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Info Universidad */}
          <div>
            <h4 className="text-2xl font-bold mb-4">Universidad Autónoma</h4>
            <p className="mb-2">Calle 5 No. 3-85 Popayán, Colombia</p>
            <p className="mb-2">PBX: (602) 8222295</p>
            <p className="mb-2">Whatsapp: 320 675 0464</p>
            <p className="mb-4">Código ICFES 2849</p>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Enlaces rápidos</h4>
            <ul className="space-y-2">
              {[
                { name: 'Simulaciones', path: '/simulaciones' },
                { name: 'Investigaciones', path: '/investigaciones' },
                { name: 'Podcast', path: '/podcast' },
                { name: 'Quiénes somos', path: '/quienes-somos' },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.path}
                    className="hover:text-blue-300 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Redes Sociales */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Síguenos</h4>
            <div className="flex space-x-4">
              <SocialIcon
                url="https://www.facebook.com/uniautonomadc/"
                bg="bg-blue-600"
                hover="hover:bg-blue-700"
                label="Facebook"
                icon="facebook"
              />
              <SocialIcon
                url="https://x.com/uniautonomadc"
                bg="bg-black"
                hover="hover:bg-gray-800"
                label="X (Twitter)"
                icon="x"
              />
              <SocialIcon
                url="https://www.instagram.com/uniautonomadelcauca/"
                bg="bg-gradient-to-r from-purple-500 to-pink-500"
                hover="hover:from-purple-600 hover:to-pink-600"
                label="Instagram"
                icon="instagram"
              />
            </div>
          </div>
        </div>
      </footer>

      {/* Estilos para animaciones y efectos */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }
        
        .hover\:scale-102:hover {
          transform: scale(1.02);
        }
        
        /* Smooth transitions for all elements */
        * {
          transition-property: transform, opacity, background-color, border-color, box-shadow;
          transition-duration: 300ms;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
};

// Componente auxiliar para iconos sociales
const SocialIcon = ({ url, bg, hover, label, icon }) => {
  const icons = {
    facebook: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
      </svg>
    ),
    x: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
      </svg>
    ),
    instagram: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
      </svg>
    ),
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`w-10 h-10 ${bg} rounded-full flex items-center justify-center ${hover} transition`}
    >
      <span className="sr-only">{label}</span>
      {icons[icon]}
    </a>
  );
};

export default AyudaT;