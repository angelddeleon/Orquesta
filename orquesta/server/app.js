import express from "express";
import dotenv from "dotenv";
import routes from "./routes/routes.js";
import errorHandler from "./middlewares/errorHandler.js";
import cors from "cors";
import cookieParser from 'cookie-parser';

dotenv.config(); // Cargar variables de entorno

const app = express()

// Middleware para manejar JSON
app.use(express.json());

// Middleware para manejar CORS
app.use(cors({
    origin: 'http://localhost:5173',
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

export default app;