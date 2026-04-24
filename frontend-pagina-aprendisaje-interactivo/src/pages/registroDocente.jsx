import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Alerta from "../components/AlertasDocente";
import { FaUserGraduate, FaIdCard, FaLock, FaCode, FaGraduationCap, FaSpinner, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa'
import { useForm } from "react-hook-form"
import { UseDocente } from "../context/DocenteContext"
import { UseRegistro } from "../context/RegristroContext";

const RegistrarDocente = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const { ValidacionToken } = UseRegistro();
    const { sigout, errors: DocenteErrors = [], mensaje } = UseDocente();
    const [registroExitoso, setRegistroExitoso] = useState(false);
    const [mostrandoExito, setMostrandoExito] = useState(false);
    const [segundosRestantes, setSegundosRestantes] = useState(5);

    // Estados para validación de token
    const [tokenStatus, setTokenStatus] = useState('loading'); // 'loading', 'valid', 'invalid', 'expired'
    const [tokenMessage, setTokenMessage] = useState('');
    const [userEmail, setUserEmail] = useState('');

    // Función para validar token - VERSION ROBUSTA
    const validarToken = async () => {
        try {
            setTokenStatus('loading');
            const result = await ValidacionToken(token);
            
            console.log("Resultado completo de ValidacionToken:", result);
            
            // Caso 1: ValidacionToken devuelve una Response de fetch
            if (result && typeof result.json === 'function') {
                const data = await result.json();
                console.log("Datos parseados:", data);
                
                if (!result.ok) {
                    if (result.status === 401) {
                        setTokenStatus('expired');
                        setTokenMessage('El enlace ha expirado o no es válido. Solicite un nuevo enlace de registro.');
                    } else if (result.status === 400) {
                        setTokenStatus('invalid');
                        setTokenMessage('El formato del enlace no es válido.');
                    } else {
                        setTokenStatus('invalid');
                        setTokenMessage(data.message || 'Error al validar el enlace de registro.');
                    }
                    return;
                }
                
                // Token válido
                setTokenStatus('valid');
                setUserEmail(data.email || data.Email || '');
                setTokenMessage(`Token válido para ${data.email || data.Email || 'usuario'}`);
                console.log("✅ Token válido:", data);
                return;
            }
            
            // Caso 2: ValidacionToken devuelve directamente los datos
            if (result && (result.email || result.Email)) {
                setTokenStatus('valid');
                setUserEmail(result.email || result.Email);
                setTokenMessage(`Token válido para ${result.email || result.Email}`);
                console.log("✅ Token válido:", result);
                return;
            }
            
            // Caso 3: ValidacionToken devuelve un error
            if (result && result.error) {
                if (result.error.includes('expirado') || result.error.includes('expired')) {
                    setTokenStatus('expired');
                    setTokenMessage('El enlace ha expirado. Solicite un nuevo enlace de registro.');
                } else {
                    setTokenStatus('invalid');
                    setTokenMessage(result.error || 'El enlace no es válido.');
                }
                return;
            }
            
            // Caso 4: Respuesta inesperada
            console.warn("Respuesta inesperada:", result);
            setTokenStatus('invalid');
            setTokenMessage('Respuesta inesperada del servidor. Intente nuevamente.');

        } catch (error) {
            console.error("❌ Error en la validación del token:", error);
            
            // Manejo de diferentes tipos de errores
            if (error.response) {
                // Error HTTP
                if (error.response.status === 401) {
                    setTokenStatus('expired');
                    setTokenMessage('El enlace ha expirado o no es válido.');
                } else if (error.response.status === 400) {
                    setTokenStatus('invalid');
                    setTokenMessage('El formato del enlace no es válido.');
                } else {
                    setTokenStatus('invalid');
                    setTokenMessage('Error del servidor. Intente nuevamente.');
                }
            } else if (error.name === 'TypeError' && error.message.includes('json')) {
                // Error específico de .json()
                setTokenStatus('invalid');
                setTokenMessage('Error en el formato de respuesta del servidor.');
            } else {
                // Error general
                setTokenStatus('invalid');
                setTokenMessage('Error de conexión. Verifique su conexión a internet.');
            }
        }
    };

    // Validar token al cargar el componente
    useEffect(() => {
        if (token) {
            validarToken();
        } else {
            setTokenStatus('invalid');
            setTokenMessage('No se proporcionó un token válido en la URL.');
        }
    }, [token]);

    // Efecto para manejar redirección después de registro exitoso
    useEffect(() => {
        if (registroExitoso && mostrandoExito) {
            const timer = setInterval(() => {
                setSegundosRestantes((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        navigate('/'); // Redirigir al inicio
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [registroExitoso, mostrandoExito, navigate]);

    // Componente de carga
    const ComponenteCarga = () => (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
            <div className="text-center bg-white p-12 rounded-2xl shadow-xl max-w-md mx-4">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-6"></div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Validando enlace...
                </h3>
                <p className="text-gray-600">
                    Por favor espere mientras verificamos su token de acceso.
                </p>
            </div>
        </div>
    );

    // Componente de error/expiración
    const ComponenteError = () => (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
            <div className="text-center bg-white p-12 rounded-2xl shadow-xl max-w-md mx-4 border-t-4 border-red-500">
                <div className="mb-6">
                    <FaExclamationTriangle className="text-6xl text-red-500 mx-auto mb-4" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {tokenStatus === 'expired' ? 'Enlace Expirado' : 'Enlace No Válido'}
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                    {tokenMessage}
                </p>
                <div className="space-y-4">
                    
                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                    >
                        Ir al Inicio
                    </button>
                    
                </div>
                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                        <strong>¿Necesita ayuda?</strong><br />
                        Contacte al administrador del sistema:<br />
                        📧 plataformaingenieria@uniautonoma.edu.co<br />
                        📞 +57 320 675 0464
                    </p>
                </div>
            </div>
        </div>
    );

    // Si está cargando, mostrar pantalla de carga
    if (tokenStatus === 'loading') {
        return <ComponenteCarga />;
    }

    // Si el token es inválido o expirado, mostrar error
    if (tokenStatus === 'invalid' || tokenStatus === 'expired') {
        return <ComponenteError />;
    }

    // Si el token es válido, mostrar el formulario
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Notificación de token válido */}
            <div className="bg-green-500 text-white text-center py-3 px-4">
                <div className="flex items-center justify-center">
                    <FaCheckCircle className="mr-2" />
                    <span className="font-medium">
                        Enlace válido {userEmail && `para ${userEmail}`} - Complete su registro a continuación
                    </span>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row min-h-screen">
                {/* Sección de imagen - Lado izquierdo */}
                <div className="lg:w-1/2 relative overflow-hidden">
                    {/* Imagen de fondo */}
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{
                            backgroundImage: "url('/img/DSC04949.jpg')"
                        }}
                    >
                        {/* Overlay más sutil sin fondo morado */}
                        <div className="absolute inset-0 bg-black/20"></div>
                    </div>

                    {/* Contenido sobre la imagen - más abajo */}
                    <div className="relative z-10 flex items-end justify-center h-full pb-16">
                        <div className="text-center text-white px-8 lg:px-12">
                            <div className="mb-6">
                                <FaGraduationCap className="text-6xl lg:text-7xl mx-auto mb-4 drop-shadow-lg" />
                            </div>
                            <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold mb-3 leading-tight drop-shadow-lg">
                                Sistema de Gestión Académica
                            </h1>
                            <p className="text-base lg:text-lg opacity-90 leading-relaxed max-w-sm mx-auto drop-shadow-md">
                                Registro de nuevos docentes en la plataforma educativa institucional
                            </p>
                            <div className="mt-6 flex justify-center space-x-4">
                                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                                <div className="w-3 h-3 bg-white/70 rounded-full animate-pulse delay-100"></div>
                                <div className="w-3 h-3 bg-white/50 rounded-full animate-pulse delay-200"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sección del formulario - Lado derecho */}
                <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
                    <div className="w-full max-w-md">
                        {/* Encabezado del formulario */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4 shadow-lg">
                                <FaUserGraduate className="text-2xl text-white" />
                            </div>
                            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2 text-center">
                                Registro de Docente
                            </h2>
                            <p className="text-gray-600 text-center">
                                Complete los datos para crear una nueva cuenta
                            </p>
                            {/* Mostrar email del token si está disponible */}
                            {userEmail && (
                                <div className="mt-3 p-3 bg-green-50 rounded-lg text-sm text-green-700 border border-green-200 text-center">
                                    Registrando cuenta para: <strong>{userEmail}</strong>
                                </div>
                            )}
                        </div>

                        {/* Alertas */}
                        <div className="mb-6">
                            {DocenteErrors.length > 0 && (
                                <div className="space-y-2">
                                    {DocenteErrors.map((error, i) => (
                                        <div key={i} className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
                                            <div className="flex items-center justify-center">
                                                <FaExclamationTriangle className="mr-2 text-red-500" />
                                                <span className="font-medium">{error.msg || error}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {mensaje && !registroExitoso && (
                                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-center">
                                    <div className="flex items-center justify-center">
                                        <FaCheckCircle className="mr-2 text-green-500" />
                                        <span className="font-medium">{mensaje}</span>
                                    </div>
                                </div>
                            )}
                            {registroExitoso && mostrandoExito && (
                                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-center animate-pulse">
                                    <div className="flex items-center justify-center mb-3">
                                        <FaCheckCircle className="mr-2 text-green-500 text-lg" />
                                        <span className="font-bold">¡Registro completado exitosamente!</span>
                                    </div>
                                    <div className="text-sm">
                                        <p className="mb-2">Tu cuenta de docente ha sido creada correctamente.</p>
                                        <p className="flex items-center justify-center">
                                            <FaSpinner className="mr-2 animate-spin" />
                                            Redirigiendo al inicio en {segundosRestantes} segundo{segundosRestantes !== 1 ? 's' : ''}...
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => navigate('/')}
                                        className="mt-3 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                                    >
                                        Ir ahora al inicio
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Formulario */}
                        <form onSubmit={handleSubmit(async (values) => {
                            const valuesConRolYToken = {
                                ...values,
                                rol: "Docente",
                                token: token, // Incluir el token en el envío
                                email: userEmail || '' // Agregar el email del token
                            };
                            const resultado = await sigout(valuesConRolYToken);
                            console.log("Datos enviados:", valuesConRolYToken);
                            
                            if (resultado?.success) {
                                setRegistroExitoso(true);
                                setMostrandoExito(true);
                                setSegundosRestantes(5); // Reiniciar contador
                                // El useEffect se encargará de la redirección automática
                            }
                        })} className="space-y-6">

                            {/* Nombre completo */}
                            <div className="relative">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nombre Completo
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaUserGraduate className="text-gray-400 text-lg" />
                                    </div>
                                    <input
                                        type="text"
                                        {...register('Nombre', {
                                            required: 'El nombre es requerido',
                                            minLength: { value: 2, message: 'El nombre debe tener al menos 2 caracteres' }
                                        })}
                                        className="w-full pl-12 pr-4 py-3 text-gray-800 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                                        placeholder="Ingrese el nombre completo"
                                    />
                                </div>
                                {errors.Nombre && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center">
                                        <span className="mr-1">⚠</span>
                                        {errors.Nombre.message}
                                    </p>
                                )}
                            </div>

                            {/* Número de identificación */}
                            <div className="relative">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Número de Identificación
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaIdCard className="text-gray-400 text-lg" />
                                    </div>
                                    <input
                                        type="text"
                                        {...register('identificacion', {
                                            required: 'El número de identificación es requerido',
                                            pattern: { value: /^[0-9]+$/, message: 'Solo se permiten números' }
                                        })}
                                        className="w-full pl-12 pr-4 py-3 text-gray-800 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                                        placeholder="Ej: 1234567890"
                                    />
                                </div>
                                {errors.identificacion && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center">
                                        <span className="mr-1">⚠</span>
                                        {errors.identificacion.message}
                                    </p>
                                )}
                            </div>
                            {/* Contraseña */}
                            <div className="relative">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className="text-gray-400 text-lg" />
                                    </div>
                                    <input
                                        type="password"
                                        {...register('contrasena', {
                                            required: 'La contraseña es requerida',
                                            minLength: { value: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
                                        })}
                                        className="w-full pl-12 pr-4 py-3 text-gray-800 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                                        placeholder="••••••••"
                                    />
                                </div>
                                {errors.contrasena && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center">
                                        <span className="mr-1">⚠</span>
                                        {errors.contrasena.message}
                                    </p>
                                )}
                            </div>

                            {/* Botón de envío */}
                            <button
                                type="submit"
                                disabled={registroExitoso}
                                className={`w-full font-semibold py-3 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200 shadow-lg ${
                                    registroExitoso 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 hover:scale-105 hover:shadow-xl'
                                }`}
                            >
                                <span className="flex items-center justify-center">
                                    {registroExitoso ? (
                                        <>
                                            <FaCheckCircle className="mr-2" />
                                            Registro Completado
                                        </>
                                    ) : (
                                        <>
                                            <FaUserGraduate className="mr-2" />
                                            Completar Registro
                                        </>
                                    )}
                                </span>
                            </button>
                        </form>

                        {/* Footer del formulario */}
                        <div className="mt-8 text-center">
                            <p className="text-sm text-gray-500">
                                ¿Necesitas ayuda?
                                <a href="mailto:admin@uniautonoma.edu.co" className="text-blue-600 hover:text-blue-800 ml-1 font-medium">
                                    Contacta soporte técnico
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistrarDocente;