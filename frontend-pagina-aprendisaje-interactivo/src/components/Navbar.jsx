import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Search, User, Menu, X, ChevronDown, HelpCircle } from "lucide-react";
import Swal from "sweetalert2";
import { useLogin } from "../context/LoginContext";

const navLinks = [
  { to: "/simulaciones", label: "Simulaciones" },
  { to: "/appmovil", label: "Aplicaciones móviles" },
  { to: "/investigaciones", label: "Investigación" },
  { to: "/podcast", label: "Podcast" },
  { to: "/quienes-somos", label: "Quiénes somos" },
];

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const dropdownRef = useRef(null);
  const { signout, Usuario, isAuthenticated } = useLogin();

  const rol =
    Usuario?.Rol ?? Usuario?.rol ?? localStorage.getItem("Rol") ?? "";
  const esAdministrador = rol === "Administrador";
  const esDocente = rol === "Docente";

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setIsDropdownOpen(false);
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onPointer = (e) => {
      if (!dropdownRef.current?.contains(e.target)) setIsDropdownOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("touchstart", onPointer);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("touchstart", onPointer);
    };
  }, []);

  const ejecutarBusqueda = () => {
    const q = busqueda.trim();
    if (q) window.location.href = `/resultados?query=${encodeURIComponent(q)}`;
  };

  const cerrarSesion = () => {
    Swal.fire({
      title: "¿Cerrar sesión?",
      text: "¿Seguro que deseas cerrar sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--color-primary)",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await signout();
        localStorage.clear();
        window.location.href = "/";
      }
    });
  };

  return (
    <header className="nav-surface sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 shadow-[var(--shadow-sm)] md:bg-[var(--color-surface)]/90 md:shadow-[var(--shadow-sm)] md:backdrop-blur-md">
      <nav
        className="mx-auto flex h-[var(--nav-h)] max-w-7xl items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8"
        aria-label="Principal"
      >
        {/* Logo aislado a la izquierda; navegación en bloque separado (jerarquía clara). */}
        <div className="flex min-w-0 flex-1 items-stretch gap-0 md:gap-0">
          <Link
            to="/"
            className="flex shrink-0 items-center self-center rounded-lg py-1 pr-6 outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] sm:pr-8 md:border-r md:border-[var(--color-border)] md:pr-10 lg:pr-12"
          >
            <img
              src="/img/logos autonoma_2.png"
              alt="Universidad Autónoma — Inicio"
              className="h-9 w-auto sm:h-10"
              width={140}
              height={40}
              loading="lazy"
              decoding="async"
            />
          </Link>

          <div className="hidden min-w-0 flex-1 items-center md:flex md:pl-6 lg:pl-8">
            <div className="flex flex-wrap items-center gap-0.5 lg:gap-1">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="rounded-lg px-3 py-2 text-sm font-medium tracking-tight text-slate-600 transition duration-200 ease-out hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 active:scale-[0.98]"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="relative hidden sm:block">
            <label className="sr-only" htmlFor="nav-busqueda">
              Buscar en el sitio
            </label>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              strokeWidth={1.75}
              aria-hidden
            />
            <input
              id="nav-busqueda"
              type="search"
              placeholder="Buscar…"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") ejecutarBusqueda();
              }}
              className="h-10 w-40 rounded-lg border border-[var(--color-border)] bg-white py-2 pl-9 pr-3 text-sm font-normal text-slate-900 shadow-[var(--shadow-sm)] transition duration-200 ease-out placeholder:text-slate-400 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 lg:w-52"
            />
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((o) => !o)}
              className="flex h-11 min-w-[44px] items-center justify-center gap-1 rounded-lg border border-transparent text-slate-600 transition duration-200 ease-out hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 active:scale-[0.98]"
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
              aria-label="Menú de cuenta"
            >
              <User className="h-6 w-6" strokeWidth={1.75} />
              <ChevronDown
                className={`hidden h-4 w-4 sm:block transition-transform duration-200 ease-out ${isDropdownOpen ? "rotate-180" : ""}`}
                strokeWidth={1.75}
                aria-hidden
              />
            </button>

            {isDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-[min(100vw-2rem,16rem)] overflow-hidden rounded-xl border border-[var(--color-border)] bg-white py-1 shadow-lg ring-1 ring-black/5"
                role="menu"
              >
                {!isAuthenticated ? (
                  <Link
                    to="/login"
                    role="menuitem"
                    className="block px-4 py-3 text-sm font-medium text-slate-800 hover:bg-slate-50"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Iniciar sesión
                  </Link>
                ) : (
                  <>
                    {esAdministrador && (
                      <>
                        <Link
                          to="/menuadministrador"
                          role="menuitem"
                          className="block px-4 py-3 text-sm font-medium text-slate-800 hover:bg-slate-50"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Panel administrador
                        </Link>
                        <Link
                          to="/menudocente"
                          role="menuitem"
                          className="block px-4 py-3 text-sm font-medium text-slate-800 hover:bg-slate-50"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Panel docente
                        </Link>
                      </>
                    )}
                    {esDocente && !esAdministrador && (
                      <Link
                        to="/menudocente"
                        role="menuitem"
                        className="block px-4 py-3 text-sm font-medium text-slate-800 hover:bg-slate-50"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Panel docente
                      </Link>
                    )}
                    <div className="my-1 h-px bg-[var(--color-border)]" />
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        cerrarSesion();
                      }}
                      className="block w-full px-4 py-3 text-left text-sm font-medium text-red-700 hover:bg-red-50"
                    >
                      Cerrar sesión
                    </button>
                  </>
                )}
                <Link
                  to="/ayuda"
                  role="menuitem"
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-800 hover:bg-slate-50"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <HelpCircle className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                  Ayuda
                </Link>
              </div>
            )}
          </div>

          <button
            type="button"
            className="inline-flex h-11 min-w-[44px] items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] md:hidden"
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-expanded={isMenuOpen}
            aria-controls="nav-movil"
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" strokeWidth={1.75} />
            ) : (
              <Menu className="h-6 w-6" strokeWidth={1.75} />
            )}
          </button>
        </div>
      </nav>

      <div
        id="nav-movil"
        className={`border-t border-[var(--color-border)] bg-white md:hidden ${isMenuOpen ? "block" : "hidden"}`}
      >
        <div className="max-h-[min(70vh,calc(100dvh-4rem))] space-y-1 overflow-y-auto px-3 py-4">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="block min-h-[44px] rounded-lg px-3 py-3 text-base font-medium text-slate-800 hover:bg-slate-100"
              onClick={() => setIsMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          {isAuthenticated && (
            <>
              <div className="my-2 border-t border-[var(--color-border)] pt-2">
                {esAdministrador && (
                  <>
                    <Link
                      to="/menuadministrador"
                      className="block min-h-[44px] rounded-lg px-3 py-3 text-base font-medium hover:bg-slate-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Panel administrador
                    </Link>
                    <Link
                      to="/menudocente"
                      className="block min-h-[44px] rounded-lg px-3 py-3 text-base font-medium hover:bg-slate-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Panel docente
                    </Link>
                  </>
                )}
                {esDocente && !esAdministrador && (
                  <Link
                    to="/menudocente"
                    className="block min-h-[44px] rounded-lg px-3 py-3 text-base font-medium hover:bg-slate-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Panel docente
                  </Link>
                )}
              </div>
            </>
          )}
          <Link
            to="/ayuda"
            className="flex min-h-[44px] items-center gap-2 rounded-lg px-3 py-3 text-base font-medium hover:bg-slate-100"
            onClick={() => setIsMenuOpen(false)}
          >
            <HelpCircle className="h-5 w-5" strokeWidth={1.75} aria-hidden />
            Ayuda
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
