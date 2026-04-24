import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import MenuDocente from "../components/MenuAdmi_Doc";

/**
 * Layout docente: rail fijo a altura viewport (100dvh) para evitar el bug de h-full a media altura;
 * en <lg el rail es drawer con overlay (acción táctil clara sin Framer).
 */
function MenuDocen() {
  const userRole = "docente";
  const [colapsado, setColapsado] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const mainPad = colapsado ? "lg:pl-16" : "lg:pl-[17.5rem]";

  return (
    <div className="min-h-[100dvh] bg-[var(--color-background)] text-slate-900">
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-900/20 lg:hidden"
          aria-label="Cerrar menú lateral"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        id="panel-docente-rail"
        className={`fixed inset-y-0 left-0 z-50 h-[100dvh] max-h-[100dvh] transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        aria-label="Navegación del panel docente"
      >
        <div className="h-full max-h-[100dvh]">
          <MenuDocente
            rol={userRole}
            colapsado={colapsado}
            setColapsado={setColapsado}
            onNavigate={() => setMobileOpen(false)}
          />
        </div>
      </aside>

      <button
        type="button"
        className="fixed left-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300/50 bg-[var(--color-sidebar)] text-slate-700 shadow-[var(--shadow-sm)] transition duration-200 ease-out hover:bg-white/50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 lg:hidden"
        onClick={() => setMobileOpen((o) => !o)}
        aria-expanded={mobileOpen}
        aria-controls="panel-docente-rail"
        aria-label={mobileOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
      >
        {mobileOpen ? (
          <X className="h-5 w-5" strokeWidth={1.75} />
        ) : (
          <Menu className="h-5 w-5" strokeWidth={1.75} />
        )}
      </button>

      <main
        id="panel-docente-main"
        className={`min-h-[100dvh] px-4 pb-10 pt-[4.5rem] sm:px-6 lg:px-10 lg:pb-12 lg:pt-12 ${mainPad}`}
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center sm:mb-12">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Panel docente
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Bienvenido
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-base font-normal text-slate-600">
              Publica simulaciones, investigaciones, podcast y apps desde un solo lugar.
            </p>
          </div>

          <div className="mb-10 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            {[
              {
                t: "Mis envíos",
                d: "Consulta y edita lo que ya subiste.",
              },
              {
                t: "Nuevo contenido",
                d: "Crea recursos desde el menú lateral.",
              },
              {
                t: "Ayuda",
                d: "Visita la sección Ayuda del sitio público.",
              },
            ].map((card) => (
              <div
                key={card.t}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)] transition duration-200 ease-out hover:shadow-[var(--shadow-md)]"
              >
                <h2 className="text-sm font-semibold tracking-tight text-slate-900">
                  {card.t}
                </h2>
                <p className="mt-2 text-sm font-normal leading-relaxed text-slate-600">
                  {card.d}
                </p>
              </div>
            ))}
          </div>

          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default MenuDocen;
