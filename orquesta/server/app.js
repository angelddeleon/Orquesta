const express = require("express");
const dotenv = require("dotenv");
const routes = require("./routes/routes.js");
const errorHandler = require("./middlewares/errorHandler.js");
const cors = require("cors");
const cookieParser = require('cookie-parser');

dotenv.config(); // Cargar variables de entorno

const app = express()

// Middleware para manejar JSON
app.use(express.json());

// Middleware para manejar CORS
app.use(cors({
    origin: 'http://partituras.sinfocarabobo.com',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

app.use(cookieParser()); // ¡Antes de las rutas!

// Rutas
app.use("/api", routes);

// Manejo de errores
app.use(errorHandler);

// Ruta no encontrada (404)
app.use((req, res) => {
    res.status(404).json({ message: "Ruta no encontrada" });
});

module.exports = app;