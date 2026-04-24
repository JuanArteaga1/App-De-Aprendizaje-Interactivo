import { useState } from 'react';

const Alerta = ({ tipo = "error", mensaje, onClose }) => {
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 300); // Debe coincidir con la duración de la transición
    };

    const estilos = {
        error: {
            bg: "bg-red-50",
            border: "border-l-4 border-red-500",
            text: "text-red-800",
            icon: "text-red-600",
            titulo: "Error de Registro",
            iconSVG: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
            )
        },
        exito: {
            bg: "bg-green-50",
            border: "border-l-4 border-green-500",
            text: "text-green-800",
            icon: "text-green-600",
            titulo: "Registro Exitoso",
            iconSVG: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
            )
        }
    };

    const estilo = estilos[tipo];

    return (
        <div
  className={`${estilo?.bg || ''} ${estilo?.border || ''} ${estilo?.text || ''} p-4 rounded-md shadow-sm mb-4 flex items-start transition-opacity duration-300 ease-in-out ${isClosing ? 'opacity-0' : 'opacity-100'}`}
  role="alert"
>
            <div className="flex-shrink-0 mr-3">
                {estilo.iconSVG}
            </div>
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <strong className="font-medium">{estilo.titulo}</strong>
                    <button
                        className="ml-2 focus:outline-none"
                        onClick={handleClose}
                        aria-label="Cerrar"
                    >
                        <svg
                            className={`fill-current h-5 w-5 ${estilo.icon}`}
                            viewBox="0 0 20 20"
                        >
                            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                        </svg>
                    </button>
                </div>
                <div className="mt-1 text-sm">
                    {mensaje}
                </div>
            </div>
        </div>
    );
};

export default Alerta;