const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Configuración de Multer con ruta absoluta
const upload = multer({
    dest: path.join(__dirname, '..', 'uploads', 'temp')
});

/**
 * Genera un nombre de archivo único por proyecto.
 * Formato: {seccion}_{timestamp}{extension}
 * Ejemplo: MiProyecto_1714000000000.apk
 */
const generarNombreUnico = (seccion, originalname) => {
    const ext = path.extname(originalname);                     // ".apk", ".pdf", ".png"
    const seccionSanitizada = seccion.replace(/[^a-zA-Z0-9_-]/g, '_'); // evitar caracteres raros
    const timestamp = Date.now();
    return `${seccionSanitizada}_${timestamp}${ext}`;
};

// ──────────────────────────────────────────────────────────────
// GUARDAR (creación)
// ──────────────────────────────────────────────────────────────

// Guarda imagen con nombre único por proyecto
const GuardarImagen = (req, res) => {
    try {
        const { seccion } = req.body;
        const file = req.files?.portada?.[0];
        if (!file) return res.status(400).send("No se subió archivo");

        const basePath = path.join(__dirname, '..', 'uploads');
        const seccionDir = path.join(basePath, seccion, "img");

        if (!fs.existsSync(seccionDir)) {
            fs.mkdirSync(seccionDir, { recursive: true });
        }

        const nombreUnico = generarNombreUnico(seccion, file.originalname);
        const newFilePath = path.join(seccionDir, nombreUnico);
        fs.renameSync(file.path, newFilePath);

        return newFilePath;
    } catch (error) {
        console.log(error);
        res.status(400).send("ERROR AL SUBIR LA IMAGEN");
    }
};

// Guarda documento PDF con nombre único por proyecto
const GuardarDocumento = (req, res) => {
    try {
        const { seccion } = req.body;
        const file = req.files?.urlDoc?.[0];
        if (!file) return res.status(400).send("No se subió archivo");

        const basePath = path.join(__dirname, '..', 'uploads');
        const seccionDir = path.join(basePath, seccion, "Docs");

        if (!fs.existsSync(seccionDir)) {
            fs.mkdirSync(seccionDir, { recursive: true });
        }

        const nombreUnico = generarNombreUnico(seccion, file.originalname);
        const newFilePath = path.join(seccionDir, nombreUnico);
        fs.renameSync(file.path, newFilePath);

        return newFilePath;
    } catch (error) {
        console.log(error);
        res.status(400).send("ERROR AL SUBIR EL DOCUMENTO");
    }
};

// Guarda APK con nombre único por proyecto
const GuardarAPK = (req, res) => {
    try {
        const { seccion } = req.body;
        const file = req.files?.urlArchivoapk?.[0];
        if (!file) return res.status(400).json("No se subió archivo");

        const basePath = path.join(__dirname, '..', 'uploads');
        const seccionDir = path.join(basePath, seccion, "APK");

        if (!fs.existsSync(seccionDir)) {
            fs.mkdirSync(seccionDir, { recursive: true });
        }

        const nombreUnico = generarNombreUnico(seccion, file.originalname);
        const newFilePath = path.join(seccionDir, nombreUnico);
        fs.renameSync(file.path, newFilePath);

        return newFilePath;
    } catch (error) {
        console.log(error);
        res.status(400).send("ERROR AL SUBIR EL APK");
    }
};

// ──────────────────────────────────────────────────────────────
// ELIMINAR
// ──────────────────────────────────────────────────────────────

const ELiminarArchivos = (RutaArchivo) => {
    try {
        if (!RutaArchivo) return false;
        const rutaNormalizada = path.normalize(RutaArchivo);
        if (!fs.existsSync(rutaNormalizada)) {
            return false;
        }
        fs.unlinkSync(rutaNormalizada);
        return true;
    } catch (err) {
        return false;
    }
};

// ──────────────────────────────────────────────────────────────
// ACTUALIZAR (edición)
// ──────────────────────────────────────────────────────────────

// Actualiza imagen: elimina la anterior y guarda la nueva con nombre único
const ActualizarImagen = async (req, res, RutaAnteriorI) => {
    try {
        const file = req.files?.portada?.[0];
        if (!file) return RutaAnteriorI; // Sin nueva imagen → conservar la actual

        await ELiminarArchivos(RutaAnteriorI);

        const seccion = req.body.seccion || "Otros";
        const basePath = path.join(__dirname, '..', 'uploads');
        const seccionDir = path.join(basePath, seccion, "img");
        if (!fs.existsSync(seccionDir)) {
            fs.mkdirSync(seccionDir, { recursive: true });
        }

        const nombreUnico = generarNombreUnico(seccion, file.originalname);
        const newFilePath = path.join(seccionDir, nombreUnico);
        fs.renameSync(file.path, newFilePath);
        return newFilePath;
    } catch (error) {
        console.log(error);
        return RutaAnteriorI;
    }
};

// Actualiza documento PDF: elimina el anterior y guarda el nuevo con nombre único
const ActualizarDocumento = async (req, res, RutaAnteriorD) => {
    try {
        const file = req.files?.urlDoc?.[0];
        if (!file) return RutaAnteriorD; // Sin nuevo doc → conservar el actual

        await ELiminarArchivos(RutaAnteriorD);

        const seccion = req.body.seccion || "Otros";
        const basePath = path.join(__dirname, '..', 'uploads');
        const seccionDir = path.join(basePath, seccion, "Docs");
        if (!fs.existsSync(seccionDir)) {
            fs.mkdirSync(seccionDir, { recursive: true });
        }

        if (!fs.existsSync(file.path)) {
            console.error("Archivo temporal no encontrado para el documento");
            return RutaAnteriorD;
        }

        const nombreUnico = generarNombreUnico(seccion, file.originalname);
        const newFilePath = path.join(seccionDir, nombreUnico);
        fs.renameSync(file.path, newFilePath);
        return newFilePath;
    } catch (error) {
        console.error("❌ Error en ActualizarDocumento:", error);
        return RutaAnteriorD;
    }
};

// Actualiza APK: elimina el anterior y guarda el nuevo con nombre único
const ActualizarApk = async (req, res, RutaAnteriorA) => {
    try {
        const file = req.files?.urlArchivoapk?.[0];
        if (!file) return RutaAnteriorA; // Sin nuevo APK → conservar el actual

        await ELiminarArchivos(RutaAnteriorA);

        const seccion = req.body.seccion || "Otros";
        const basePath = path.join(__dirname, '..', 'uploads');
        const seccionDir = path.join(basePath, seccion, "APK");

        if (!fs.existsSync(seccionDir)) {
            fs.mkdirSync(seccionDir, { recursive: true });
        }

        const nombreUnico = generarNombreUnico(seccion, file.originalname);
        const newFilePath = path.join(seccionDir, nombreUnico);
        fs.renameSync(file.path, newFilePath);

        return newFilePath;
    } catch (error) {
        console.log("❌ Error en ActualizarApk:", error);
        return RutaAnteriorA;
    }
};

// ──────────────────────────────────────────────────────────────
// EXPORTAR
// ──────────────────────────────────────────────────────────────
module.exports = {
    upload,
    GuardarImagen,
    GuardarDocumento,
    GuardarAPK,
    ActualizarImagen,
    ActualizarDocumento,
    ActualizarApk,
    ELiminarArchivos
};
