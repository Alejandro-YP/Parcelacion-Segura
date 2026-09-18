const express = require("express");
const cors = require("cors");

const app = express();


app.use(cors());

app.use(express.json());


app.get("/", (req, res) => {

    res.json({
        mensaje: "Servidor de Parcelación Segura funcionando"
    });

});


app.post("/login", (req, res) => {

    const { usuario, contrasena } = req.body;



    if (!usuario || !contrasena) {

        return res.status(400).json({

            mensaje: "El usuario y la contraseña son obligatorios."

        });

    }



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



    return res.status(401).json({

        mensaje: "Usuario o contraseña incorrectos."

    });

});


const PORT = 3001;

app.listen(PORT, () => {

    console.log(
        `Servidor ejecutándose en http://localhost:${PORT}`
    );

});