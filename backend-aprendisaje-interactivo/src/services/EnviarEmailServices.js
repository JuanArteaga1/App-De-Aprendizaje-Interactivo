const { transporter } = require("../schemas/Authgoogle.js");
require('dotenv').config();

exports.EnviarEmail = async (email, token) => {
    try {
        console.log("📨 Enviando email de verificación...");

        const mailOptions = {
            from: {
                name: 'Sistema Académico - Universidad Autónoma',
                address: process.env.EMAIL_USUARIO
            },
            to: email,
            subject: "🎓 ¡Bienvenido al Sistema Académico! - Complete su registro",
            html: `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Bienvenido al Sistema Académico</title>
                <style>
                    body {
                        margin: 0;
                        padding: 0;
                        background-color: #f8fafc;
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        line-height: 1.6;
                        color: #374151;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        background: linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%);
                        padding: 30px 20px;
                        text-align: center;
                        position: relative;
                    }
                    .header img {
                        width: 100px;
                        margin-bottom: 15px;
                    }
                    .header h1 {
                        margin: 0;
                        font-size: 26px;
                        font-weight: 700;
                        color: #fff;
                    }
                    .header p {
                        margin: 5px 0 0;
                        font-size: 16px;
                        color: #f1f5f9;
                    }
                    .content {
                        padding: 40px 30px;
                    }
                    .greeting {
                        font-size: 18px;
                        color: #1f2937;
                        margin-bottom: 20px;
                        font-weight: 600;
                    }
                    .message {
                        font-size: 15px;
                        line-height: 1.7;
                        margin-bottom: 25px;
                        color: #4b5563;
                    }
                    .cta-container {
                        text-align: center;
                        margin: 30px 0;
                    }
                    .cta-button {
                        display: inline-block;
                        background: linear-gradient(135deg, #3b82f6, #6366f1);
                        color: white !important;
                        text-decoration: none;
                        padding: 16px 32px;
                        border-radius: 8px;
                        font-weight: 600;
                        font-size: 16px;
                        text-align: center;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
                    }
                    .cta-button:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
                    }
                    .link-text {
                        background-color: #f3f4f6;
                        padding: 15px;
                        border-radius: 8px;
                        margin: 20px 0;
                        border-left: 4px solid #3b82f6;
                        word-break: break-all;
                        font-family: 'Courier New', monospace;
                        font-size: 14px;
                        color: #6b7280;
                    }
                    .footer {
                        background-color: #f9fafb;
                        padding: 30px;
                        text-align: center;
                        border-top: 1px solid #e5e7eb;
                    }
                    .footer img {
                        width: 80px;
                        margin-bottom: 10px;
                    }
                    .footer p {
                        margin: 5px 0;
                        font-size: 13px;
                        color: #6b7280;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <!-- Header con logo -->
                    <div class="header">
                        <h1>¡Bienvenido!</h1>
                        <p>Sistema de Gestión Académica</p>
                    </div>

                    <!-- Contenido principal -->
                    <div class="content">
                        <div class="greeting">
                            ¡Hola y bienvenido/a a nuestro equipo docente! 👋
                        </div>

                        <div class="message">
                            Nos complace informarle que ha sido registrado/a exitosamente en nuestro 
                            <strong>Sistema de Gestión Académica</strong>. Para completar el proceso de 
                            activación de su cuenta, necesitamos que confirme sus datos.
                        </div>

                        <div class="cta-container">
                            <a href="${process.env.RUTA_CONECCION_EXTERNA}/registro-docente/${token}" class="cta-button">
                                🚀 Completar Mi Registro
                            </a>
                        </div>

                        <div class="message">
                            Si no puede hacer clic, copie y pegue este enlace en su navegador:
                        </div>
                        <div class="link-text">
                            ${process.env.RUTA_CONECCION_EXTERNA}/registro-docente/${token}
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="footer">
                        <img src="https://yt3.googleusercontent.com/UmtTs2tQBt_CvDWD3884-3pjxl72MxnhUNtlVzp52aVw2Lam-NYa-_EIWTHKnYkQ6k_AAd3E=s900-c-k-c0x00ffffff-no-rj" alt="Logo Universidad">
                        <p><strong>Universidad Autónoma - Departamento de Sistemas Académicos</strong></p>
                        <p>plataformaingenieria@uniautonoma.edu.co | Tel: +57 320 675 0464</p>
                        <p style="font-size: 12px; color: #9ca3af;">
                            © 2024 Universidad Autónoma. Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            </body>
            </html>
            `
        };

        const resultado = await transporter.sendMail(mailOptions);
        console.log("✅ Email enviado exitosamente:", resultado.messageId);
        return { success: true, messageId: resultado.messageId };

    } catch (error) {
        console.error("❌ Error enviando email:", error.message);
        return { success: false, error: error.message };
    }
};
