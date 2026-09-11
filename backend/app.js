const express = require("express");
const cors = require("cors");
const oracledb = require("oracledb");


const app = express();


// ==========================================
// CONFIGURACIÓN
// ==========================================

app.use(cors());

app.use(express.json());


// ==========================================
// CONEXIÓN A ORACLE
// ==========================================

const dbConfig = {

    user: "TU_USUARIO",

    password: "TU_CONTRASENA",

    connectString: "localhost:1521/XEPDB1"

};


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

app.post("/login", async (req, res) => {

    let connection;


    try {

        // Recibir datos del frontend

        const {
            usuario,
            contrasena
        } = req.body;


        // Verificar campos

        if (!usuario || !contrasena) {

            return res.status(400).json({

                mensaje:
                    "El usuario y la contraseña son obligatorios."

            });

        }


        // Conectar con Oracle

        connection =
            await oracledb.getConnection(dbConfig);


        // Buscar usuario

        const result =
            await connection.execute(

                `
                SELECT
                    id_usuario,
                    nombre,
                    usuario
                FROM usuarios
                WHERE usuario = :usuario
                AND contrasena = :contrasena
                `,

                {
                    usuario: usuario,
                    contrasena: contrasena
                },

                {
                    outFormat:
                        oracledb.OUT_FORMAT_OBJECT
                }

            );


        // Usuario no encontrado

        if (result.rows.length === 0) {

            return res.status(401).json({

                mensaje:
                    "Usuario o contraseña incorrectos."

            });

        }


        // Usuario encontrado

        const usuarioEncontrado =
            result.rows[0];


        // Respuesta al frontend

        res.status(200).json({

            mensaje:
                "Inicio de sesión exitoso.",

            usuario: {

                id:
                    usuarioEncontrado.ID_USUARIO,

                nombre:
                    usuarioEncontrado.NOMBRE,

                usuario:
                    usuarioEncontrado.USUARIO

            }

        });


    }

    catch (error) {

        console.error(
            "Error en el inicio de sesión:",
            error
        );


        res.status(500).json({

            mensaje:
                "Error interno del servidor."

        });

    }


    finally {

        // Cerrar conexión

        if (connection) {

            try {

                await connection.close();

            }

            catch (error) {

                console.error(
                    "Error cerrando conexión:",
                    error
                );

            }

        }

    }

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