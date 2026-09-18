const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});


app.get("/api/datos", async (req, res) => {
    try {
        const resultado = await pool.query(
            "SELECT * FROM empleados ORDER BY id ASC"
        );

        res.json(resultado.rows);

    } catch (error) {
        console.error("Error al consultar:", error);
        res.status(500).json({
            error: "Error al obtener los empleados"
        });
    }
})

app.post("/api/datos", async (req, res) => {
    try {
        const { nombre, puesto, salario } = req.body;

        if (!nombre || !puesto || !salario) {
            return res.status(400).json({
                error: "Todos los campos son obligatorios"
            });
        }

        const resultado = await pool.query(
            `INSERT INTO empleados (nombre, puesto, salario)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [nombre, puesto, salario]
        );

        res.status(201).json(resultado.rows[0]);

    } catch (error) {
        console.error("Error al insertar:", error);

        res.status(500).json({
            error: "Error al guardar el empleado"
        });
    }
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
