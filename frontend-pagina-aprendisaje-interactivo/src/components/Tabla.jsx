import React from 'react';

const TablaDinamica = ({ datos, columnas, acciones }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
      <div className="overflow-x-auto">
        
        <table className="w-full border-separate border-spacing-0 text-l">

          {/* HEADER */}
          <thead>
            <tr className="bg-indigo-50/70 backdrop-blur-sm">
              {columnas.map((col) => (
                <th 
                  key={col.key}
                  className="text-left px-5 py-3 border-b border-indigo-200 font-semibold text-indigo-700 uppercase tracking-wide text-xs"
                >
                  {col.nombre}
                </th>
              ))}

              {acciones?.length > 0 && (
                <th className="text-left px-5 py-3 border-b border-indigo-200 font-semibold text-indigo-700 uppercase tracking-wide text-xs">
                  Acciones
                </th>
              )}
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {datos?.data?.map((item, index) => (
              <tr
                key={index}
                className="
                  hover:bg-indigo-50/40 
                  transition-all 
                  border-b border-gray-100 
                  hover:shadow-sm
                "
              >
                {columnas.map((col) => (
                  <td 
                    key={col.key} 
                    className="px-5 py-3 text-gray-700"
                  >
                    {item[col.key] ?? "—"}
                  </td>
                ))}

                {/* ACCIONES */}
                {acciones?.length > 0 && (
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      {acciones.map((accion, i) => (
                        <button
                          key={i}
                          onClick={(e) => {
                            e.stopPropagation();
                            accion.fn(item);
                          }}
                          className="
                            p-2 rounded-lg 
                            bg-indigo-100 hover:bg-indigo-200 
                            text-indigo-700 hover:text-indigo-900
                            transition-all shadow-sm hover:shadow
                          "
                          title={accion.nombre}
                        >
                          {accion.componente 
                            ? accion.componente(item, accion.fn) 
                            : accion.nombre}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </div>
  );
};

export default TablaDinamica;
