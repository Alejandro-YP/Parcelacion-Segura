const express = require("express");
const cors = require("cors");

const app = express();


// ==========================================
// CONFIGURACIÓN
// ==========================================

app.use(cors());

app.use(express.json());


// ==========================================
// RUTA DE PRUEBA
// ==========================================

app.get("/", (req, res) => {

    res.json({
        mensaje: "Servidor de Parcelación Segura funcionando"
    });

});


// ==========================================
// RF-01 - INICIO DE SESIÓN
// ==========================================

app.post("/login", (req, res) => {

    const { usuario, contrasena } = req.body;


    // Verificar que los campos estén completos

    if (!usuario || !contrasena) {

        return res.status(400).json({

            mensaje: "El usuario y la contraseña son obligatorios."

        });

    }


    // ==========================================
    // USUARIO DE PRUEBA
    // ==========================================

    if (
        usuario === "admin" &&
        contrasena === "1234"
    ) {

        return res.status(200).json({

            mensaje: "Inicio de sesión exitoso.",

            usuario: {

                id: 1,

                nombre: "Administrador",

                usuario: "admin"

            }

        });

    }


    // ==========================================
    // DATOS INCORRECTOS
    // ==========================================

    return res.status(401).json({

        mensaje: "Usuario o contraseña incorrectos."

    });

});


// ==========================================
// INICIAR SERVIDOR
// ==========================================

const PORT = 3000;

app.listen(PORT, () => {

    console.log(
        `Servidor ejecutándose en http://localhost:${PORT}`
    );

});