import Swal from "sweetalert2";

const toastDefaults = {
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 4000,
  timerProgressBar: true,
};

/**
 * Mensajes breves no intrusivos para operaciones CRUD.
 * Mantiene la lógica en contextos/páginas; solo centraliza la presentación.
 */
export function notifySuccess(title, text) {
  return Swal.fire({
    ...toastDefaults,
    icon: "success",
    title,
    text: text || undefined,
  });
}

export function notifyError(title, text) {
  return Swal.fire({
    ...toastDefaults,
    icon: "error",
    title,
    text: text || undefined,
    timer: 5500,
  });
}

export function notifyWarning(title, text) {
  return Swal.fire({
    ...toastDefaults,
    icon: "warning",
    title,
    text: text || undefined,
  });
}

/** Primer mensaje legible desde errores típicos de axios / API */
export function getApiErrorMessage(error, fallback = "No se pudo completar la operación") {
  const d = error?.response?.data;
  if (!d) return fallback;
  if (typeof d === "string") return d;
  if (d.message) return d.message;
  if (d.msg) return d.msg;
  if (Array.isArray(d.errors) && d.errors.length) {
    const first = d.errors[0];
    if (typeof first === "string") return first;
    return first.msg || first.message || fallback;
  }
  return fallback;
}

export function notifyApiError(error, title = "Error") {
  return notifyError(title, getApiErrorMessage(error));
}
