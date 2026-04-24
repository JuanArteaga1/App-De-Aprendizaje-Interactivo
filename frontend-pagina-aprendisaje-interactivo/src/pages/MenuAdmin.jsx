import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import MenuDocente from "../components/MenuAdmi_Doc";

function MenuAdmin() {
  const userRole = "admin";
  const [colapsado, setColapsado] = useState(false);
  const mainPad = colapsado ? "pl-16" : "pl-[17.5rem]";

  return (
    <div className="min-h-[100dvh] bg-[var(--color-background)] text-slate-900">
      <aside
        className="fixed inset-y-0 left-0 z-20 h-[100dvh] max-h-[100dvh]"
        aria-label="Navegación del panel administrador"
      >
        <MenuDocente
          rol={userRole}
          colapsado={colapsado}
          setColapsado={setColapsado}
        />
      </aside>

      <main
        className={`min-h-[100dvh] overflow-y-auto px-4 py-10 sm:px-6 lg:px-10 lg:py-14 ${mainPad}`}
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Panel administración
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Bienvenido, administrador
            </h1>
            <p className="mt-3 text-base text-slate-600">
              Gestiona usuarios, categorías y contenidos desde un solo lugar.
            </p>
          </div>

          <div className="mb-10 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            {[
              { t: "Resumen", d: "Accede a listas y altas desde el menú lateral." },
              { t: "Docentes", d: "Cuentas y solicitudes de registro." },
              { t: "Contenidos", d: "Proyectos, categorías y materias." },
            ].map((card) => (
              <div
                key={card.t}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]"
              >
                <h2 className="text-sm font-semibold tracking-tight text-slate-900">
                  {card.t}
                </h2>
                <p className="mt-2 text-sm text-slate-600">{card.d}</p>
              </div>
            ))}
          </div>

          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default MenuAdmin;
