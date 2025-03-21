import express from "express";
import dotenv from "dotenv";
import routes from "./routes/routes.js";
import errorHandler from "./middlewares/errorHandler.js";
import cors from "cors";

dotenv.config(); // Cargar variables de entorno

const app = express();

// Middleware para manejar JSON
app.use(express.json());

// Middleware para manejar CORS
app.use(cors({
    origin: 'http://localhost:5173' // Permite este origen específico
}));

// Rutas
app.use("/api", routes);

// Manejo de errores
app.use(errorHandler);

// Ruta no encontrada (404)
app.use((req, res) => {
    res.status(404).json({ message: "Ruta no encontrada" });
});

export default app;