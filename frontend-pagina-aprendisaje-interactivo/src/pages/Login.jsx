import React, { useState, useEffect } from "react";
import imagenlogin from "../img/logou.png";
import { useLogin } from "../context/LoginContext";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Alerta from "../components/AlertasDocente";

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signin, Usuario, isAuthenticated, errors: LoginErrors } = useLogin();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    const rol = Usuario?.Rol ?? Usuario?.rol ?? localStorage.getItem("Rol");
    switch (rol) {
      case "Docente":
        navigate("/menudocente");
        break;
      case "Administrador":
        navigate("/menuadministrador");
        break;
      default:
        navigate("/");
        break;
    }
  }, [isAuthenticated, Usuario, navigate]);

  const onSubmit = handleSubmit(async (values) => {
    setLoading(true);
    try {
      await signin(values);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    } finally {
      setLoading(false);
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-md)]">
        {LoginErrors.map((error, i) => (
          <Alerta key={i} tipo="error" mensaje={error.msg || error.message} />
        ))}

        <div className="mb-8 flex justify-center">
          <img src={imagenlogin} alt="Logo institucional" className="h-24 w-auto" width={120} height={96} />
        </div>

        <h1 className="mb-6 text-center text-2xl font-bold text-slate-900">Iniciar sesión</h1>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label htmlFor="login-email" className="mb-1 block text-sm font-medium text-slate-700">
              Correo
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              {...register("email", { required: true })}
              className="w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-slate-900 shadow-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/25"
              placeholder="ejemplo@correo.com"
              disabled={loading}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">Ingrese un correo válido.</p>
            )}
          </div>

          <div>
            <label htmlFor="login-password" className="mb-1 block text-sm font-medium text-slate-700">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                {...register("contrasena", { required: true })}
                className="w-full rounded-xl border border-[var(--color-border)] px-4 py-3 pr-12 text-slate-900 shadow-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/25"
                placeholder="••••••••"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.contrasena && (
              <p className="mt-1 text-sm text-red-600">Ingrese su contraseña.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex min-h-[44px] w-full items-center justify-center rounded-xl bg-[var(--color-primary)] px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-[var(--color-primary-dark)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Ingresando…" : "Acceder"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          <span className="text-slate-400">¿Problemas para entrar?</span>{" "}
          <Link to="/ayuda" className="font-medium text-[var(--color-primary)] hover:underline">
            Ver ayuda
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
