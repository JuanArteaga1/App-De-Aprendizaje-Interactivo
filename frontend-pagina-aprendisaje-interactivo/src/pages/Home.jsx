import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Slider from "react-slick";
import { PrevArrow, NextArrow } from "../components/CustomArrows";
import { GetAllMateria } from "../api/AdmiMateria";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
  const navigate = useNavigate();
  const [materias, setMaterias] = useState([]);
  const [loadingMaterias, setLoadingMaterias] = useState(true);
  const [materiasError, setMateriasError] = useState("");

  useEffect(() => {
    let cancelado = false;
    const cargarMaterias = async () => {
      try {
        setLoadingMaterias(true);
        setMateriasError("");
        const response = await GetAllMateria();
        if (cancelado) return;
        const data = Array.isArray(response.data) ? response.data : [];
        setMaterias(data);
      } catch (error) {
        console.error("Error consultando materias:", error);
        if (!cancelado) {
          setMaterias([]);
          setMateriasError(
            "No fue posible cargar las materias. Verifica la conexión con el servidor."
          );
        }
      } finally {
        if (!cancelado) setLoadingMaterias(false);
      }
    };

    cargarMaterias();
    return () => {
      cancelado = true;
    };
  }, []);

  const materiasUI = useMemo(() => {
    return materias.map((materia) => ({
      id: materia._id,
      nombre: materia.nombre || "Materia sin nombre",
      descripcion:
        materia.descripcion ||
        "Explora contenido académico disponible para esta materia.",
      imagen:
        materia.imagen ||
        (materia.nombre?.toLowerCase().includes("fisi")
          ? "/img/physics.png"
          : materia.nombre?.toLowerCase().includes("mat")
            ? "/img/math.png"
            : "/img/civil.png"),
    }));
  }, [materias]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };

  

  return (
    <div className="w-full overflow-x-hidden bg-[var(--color-background)] text-slate-900">
      <Navbar />

      {/* Carrusel Hero */}
      <div className="hero w-full relative max-h-[1500px] overflow-hidden shadow-lg">
        <Slider {...settings} className="h-full">
          {[
            {
              src: "/img/DSC04986.jpg",
              alt: "Imagen 1",
              buttonText: "Explora nuestras simulaciones",
              link: "/simulaciones"
            },
            {
              src: "/img/DSC04949.jpg",
              alt: "Imagen 2",
              buttonText: "Consulta nuestras investigaciones",
              link: "/investigaciones"
            },
            {
              src: "/img/IMG_4525.jpeg",
              alt: "Imagen 3",
              buttonText: "Explora nuestro podcast",
              link: "/podcast"
            }
          ].map(({ src, alt, buttonText, link }, index) => (
            <div key={index} className="relative w-full h-[300px] sm:h-[450px] md:h-[600px] lg:h-[700px]">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-0" />
              <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute bottom-20 left-0 right-0 text-center">
                <button
                  onClick={() => navigate(link)}
                  className="px-8 py-3 text-lg font-semibold text-[#3C64C9] bg-white/90 hover:bg-white rounded-full border-2 border-[#3C64C9] shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                >
                  {buttonText}
                </button>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Sección de materias */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          Explora Materias
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-slate-600">
          Consulta materias disponibles y accede a su contenido académico.
        </p>
        {loadingMaterias ? (
          <div className="flex min-h-[140px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <p className="text-sm text-slate-600">Cargando materias...</p>
          </div>
        ) : materiasError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-6 text-center text-sm text-red-700">
            {materiasError}
          </div>
        ) : materiasUI.length === 0 ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-6 text-center text-sm text-amber-700">
            No hay materias registradas en este momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 md:gap-8">
            {materiasUI.map((materia) => (
              <button
                key={materia.id}
                type="button"
                onClick={() => navigate(`/materias/${materia.id}/contenido`)}
                className="group relative min-h-[240px] rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100 p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#3C64C9]/30 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
              >
                <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="h-full w-full bg-[radial-gradient(circle_at_top_right,_rgba(60,100,201,0.18),_transparent_50%)]" />
                </div>
                <div className="relative z-10">
                  <span className="inline-flex rounded-full bg-[#3C64C9]/10 px-3 py-1 text-xs font-semibold tracking-wide text-[#3C64C9]">
                    Materia
                  </span>
                  <h3 className="mt-4 line-clamp-2 text-2xl font-bold text-slate-900">
                    {materia.nombre}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">
                    {materia.descripcion}
                  </p>
                </div>
                <div className="relative z-10 mt-6 flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#3C64C9] transition group-hover:text-[#274a9d]">
                    Ver contenido
                  </span>
                  <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
                    Disponible
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Sección Quiénes somos */}
      <section
        className="relative bg-gradient-to-r from-[#3C64C9] to-[#2a4fa2] py-20 px-4 text-white"
        style={{
          clipPath: 'polygon(0 5%, 100% 0, 100% 95%, 0 100%)',
          marginTop: '5rem',
          marginBottom: '5rem'
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <h3 className="text-4xl font-bold mb-6 leading-tight">
              ¿Quiénes somos?
            </h3>
            <p className="text-xl mb-8 leading-relaxed">
              Somos una universidad comprometida con la educación, la investigación y el desarrollo
              de nuestra comunidad académica. Con una tradición de excelencia, buscamos transformar la
              educación superior en Colombia.
            </p>
            <button
              onClick={() => navigate("/quienes-somos")}
              className="px-8 py-4 bg-white text-[#3C64C9] rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer hover:scale-110"
            >
              Conoce más sobre nosotros
            </button>
          </div>
          <div className="lg:w-1/2 mt-8 lg:mt-0">
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <img
                src="/img/DSC04860.jpg"
                alt="Quiénes somos"
                className="w-full h-auto object-cover transform hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 px-4 pb-10 pt-16 text-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-2xl font-bold mb-4">Universidad Autónoma</h4>
            <p className="mb-2">Calle 5 No. 3-85 Popayán, Colombia</p>
            <p className="mb-2">PBX: (602) 8222295</p>
            <p className="mb-2">Whatsapp: 320 675 0464</p>
            <p className="mb-4">Código ICFES 2849</p>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-4">Enlaces rápidos</h4>
            <ul className="space-y-2">
              <li><a href="/simulaciones" className="hover:text-blue-300 transition ">Simulaciones</a></li>
              <li><a href="/investigaciones" className="hover:text-blue-300 transition">Investigaciones</a></li>
              <li><a href="/podcast" className="hover:text-blue-300 transition">Podcast</a></li>
              <li><a href="/quienes-somos" className="hover:text-blue-300 transition">Quiénes somos</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-4">Síguenos</h4>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/uniautonomadc/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition">
                <span className="sr-only">Facebook</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://x.com/uniautonomadc" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition">
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="https://www.instagram.com/uniautonomadelcauca/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition">
                <span className="sr-only">Instagram</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-gray-800 text-center">
          <p>&copy; {new Date().getFullYear()} Universidad Autónoma. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;