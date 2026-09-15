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

            mensaje:
                "El usuario y la contraseña son obligatorios."

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

            mensaje:
                "Inicio de sesión exitoso.",

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

        mensaje:
            "Usuario o contraseña incorrectos."

    });

});


// ==========================================
// INGRESOS
// ==========================================

// Almacenamiento temporal de los ingresos.
// Más adelante se puede reemplazar por la base de datos.

let ingresos = [];

let siguienteId = 1;


// ==========================================
// CONSULTAR INGRESOS
// ==========================================

app.get("/ingresos", (req, res) => {

    res.json(ingresos);

});


// ==========================================
// REGISTRAR INGRESO
// ==========================================

app.post("/ingresos", (req, res) => {

    const {
        trabajador,
        propiedad,
        actividad
    } = req.body;


    // Verificar campos obligatorios

    if (
        !trabajador ||
        !propiedad ||
        !actividad
    ) {

        return res.status(400).json({

            mensaje:
                "Trabajador, propiedad y actividad son obligatorios."

        });

    }


    // Obtener hora actual

    const ahora = new Date();


    const horaIngreso =
        ahora.toLocaleTimeString(
            "es-CO",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    // Crear nuevo registro

    const nuevoIngreso = {

        id: siguienteId++,

        trabajador: trabajador,

        propiedad: propiedad,

        actividad: actividad,

        horaIngreso: horaIngreso,

        horaSalida: null,

        estado: "Dentro",

        empresa: "Registro manual"

    };


    // Guardar ingreso

    ingresos.push(nuevoIngreso);


    // Responder al frontend

    res.status(201).json({

        mensaje:
            "Ingreso registrado correctamente.",

        ingreso: nuevoIngreso

    });

});


// ==========================================
// REGISTRAR SALIDA
// ==========================================

app.patch("/ingresos/:id/salida", (req, res) => {

    const id = Number(req.params.id);


    // Buscar ingreso

    const ingreso =
        ingresos.find(
            item => item.id === id
        );


    // Si no existe

    if (!ingreso) {

        return res.status(404).json({

            mensaje:
                "Ingreso no encontrado."

        });

    }


    // Verificar si ya tiene salida

    if (
        ingreso.estado ===
        "Salida registrada"
    ) {

        return res.status(400).json({

            mensaje:
                "La salida ya fue registrada."

        });

    }


    // Obtener hora actual

    const ahora = new Date();


    const horaSalida =
        ahora.toLocaleTimeString(
            "es-CO",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    // Actualizar registro

    ingreso.horaSalida =
        horaSalida;


    ingreso.estado =
        "Salida registrada";


    // Responder al frontend

    res.json({

        mensaje:
            "Salida registrada correctamente.",

        ingreso: ingreso

    });

});


// ==========================================
// INICIAR SERVIDOR
// ==========================================

const PORT = 3001;


app.listen(PORT, () => {

    console.log(
        `Servidor ejecutándose en http://localhost:${PORT}`
    );

});