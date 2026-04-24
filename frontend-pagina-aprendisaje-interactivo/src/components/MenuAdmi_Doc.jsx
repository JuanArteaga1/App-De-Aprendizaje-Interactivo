import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../context/LoginContext";
import Swal from "sweetalert2";
import {
  Home,
  Upload,
  FileText,
  Mic,
  Monitor,
  Folder,
  LogOut,
  Users,
  UserPlus,
  CheckCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
} from "lucide-react";

const iconProps = { className: "h-5 w-5 shrink-0", strokeWidth: 1.75 };

/**
 * Rail lateral estilo Linear/Vercel: superficie clara, una sola sombra suave,
 * tipografía con peso 500 en enlaces, transiciones solo en transform/opacity/colores (GPU).
 */
const MenuAdministrador = ({
  rol,
  colapsado: colapsadoProp,
  setColapsado: setColapsadoProp,
  onNavigate,
}) => {
  const navigate = useNavigate();
  // Asume que useLogin proporciona la función signout
  const { signout } = useLogin();
  const [colapsadoLocal, setColapsadoLocal] = useState(false);
  const colapsado = colapsadoProp !== undefined ? colapsadoProp : colapsadoLocal;
  const setColapsado = setColapsadoProp ?? setColapsadoLocal;

  /**
   * Muestra un SweetAlert2 para confirmar el cierre de sesión.
   * Si se confirma, llama a signout() y navega a la página de inicio.
   */
  const handleCerrarSesion = () => {
    Swal.fire({
      title: "¿Cerrar sesión?",
      text: "¿Seguro que deseas cerrar sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        signout();
        navigate("/");
      }
    });
  };

  /**
   * Opciones de menú definidas por rol.
   */
  const opcionesMenu = {
    admin: [
      { nombre: "Inicio", ruta: "/", Icon: Home },
      { nombre: "Administrar Usuarios", ruta: "/AdministrarDocente", Icon: Users },
      { nombre: "Registrar Usuario", ruta: "/SubirDocente", Icon: UserPlus },
      { nombre: "Gestión de Categorías", ruta: "/SubirCategoria", Icon: Settings },
      { nombre: "Gestión de Materias", ruta: "/SubirMateria", Icon: Settings },
      { nombre: "Lista de Categorías", ruta: "/categorias", Icon: Folder },
      { nombre: "Lista de Materias", ruta: "/materias", Icon: Folder },
      { nombre: "Proyectos", ruta: "/VerProyectos", Icon: FileText },
      { nombre: "Comentarios", ruta: "/comentarios", Icon: MessageSquare },
      { nombre: "Menú Docente", ruta: "/menudocente", Icon: CheckCircle },
    ],
    docente: [
      { nombre: "Inicio", ruta: "/", Icon: Home },
      { nombre: "Subir Aplicación", ruta: "/subir-proyecto", Icon: Upload },
      { nombre: "Subir Simulaciones", ruta: "/subirsimulaciones", Icon: Monitor },
      { nombre: "Subir Investigación", ruta: "/SubirInvestigaciones", Icon: FileText },
      { nombre: "Subir Podcasts", ruta: "/subir-podcast", Icon: Mic },
      { nombre: "Mis Proyectos", ruta: "/misproyectos", Icon: Folder },
    ],
  };

  // Selecciona las opciones basadas en el rol, o usa las de docente como fallback
  const opciones = opcionesMenu[rol] || opcionesMenu.docente;
  const anchoRail = colapsado ? "w-16" : "w-[17.5rem]";

  return (
    // Contenedor principal: usa 'flex flex-col' para apilar elementos y 'h-full' para tomar toda la altura.
    <div
      className={`flex h-full min-h-0 flex-col border-r border-slate-300/50 bg-[var(--color-sidebar)] text-slate-900 shadow-[var(--shadow-sidebar)] transition-[width] duration-200 ease-out ${anchoRail}`}
    >
      <div className="relative flex h-14 shrink-0 items-center border-b border-slate-300/40 px-3">
        {!colapsado && (
          <div className="min-w-0 pl-1">
            <p className="truncate text-xs font-medium tracking-tight text-slate-500">
              {rol === "admin" ? "Administración" : "Docente"}
            </p>
            <p className="truncate text-sm font-semibold tracking-tight text-slate-900">
              {rol === "admin" ? "Panel" : "Tu espacio"}
            </p>
          </div>
        )}
        <button
          type="button"
          onClick={() => setColapsado(!colapsado)}
          className="absolute -right-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-slate-300/50 bg-[var(--color-sidebar)] text-slate-600 shadow-[var(--shadow-sm)] transition duration-200 ease-out hover:scale-[1.02] hover:bg-white/60 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
          aria-label={colapsado ? "Expandir menú lateral" : "Contraer menú lateral"}
        >
          {colapsado ? (
            <ChevronRight {...iconProps} className="h-4 w-4" />
          ) : (
            <ChevronLeft {...iconProps} className="h-4 w-4" />
          )}
        </button>
      </div>

      <nav
        className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-2 py-3"
        aria-label={rol === "admin" ? "Navegación administración" : "Navegación docente"}
      >
        <ul className="flex flex-col gap-0.5">
          {opciones.map((opcion) => {
            const Icon = opcion.Icon;
            return (
              <li key={opcion.ruta + opcion.nombre}>
                <Link
                  to={opcion.ruta}
                  title={colapsado ? opcion.nombre : undefined}
                  onClick={() => onNavigate?.()}
                  className="group flex min-h-[44px] items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium text-slate-600 transition-colors duration-200 ease-out hover:bg-white/55 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 active:scale-[0.98]"
                >
                  <Icon {...iconProps} className="text-slate-500 group-hover:text-slate-800" />
                  {!colapsado && (
                    <span className="truncate tracking-tight">{opcion.nombre}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="shrink-0 border-t border-slate-300/40 p-3">
        <button
          type="button"
          onClick={handleCerrarSesion}
          className={`flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 py-2.5 text-sm font-medium text-white shadow-[var(--shadow-sm)] transition duration-200 ease-out hover:scale-[1.01] hover:bg-slate-800 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 ${colapsado ? "px-2" : ""}`}
          aria-label="Cerrar sesión"
        >
          <LogOut className="h-5 w-5 shrink-0 text-white" strokeWidth={1.75} />
          {!colapsado && <span className="tracking-tight">Cerrar sesión</span>}
        </button>
      </div>
    </div>
  );
};

export default MenuAdministrador;