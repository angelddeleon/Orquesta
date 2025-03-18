import { Router } from "express";
import {
    getRegistros,
    getRegistroById,
    createRegistro,
    updateRegistro,
    deleteRegistro,
} from "../controllers/registroController.js";

const router = Router();

// Rutas para registros
router.get("/registros", getRegistros); // Obtener todos los registros (con paginación)
router.get("/registros/:id", getRegistroById); // Obtener un registro por ID
router.post("/registros", createRegistro); // Crear un nuevo registro
router.put("/registros/:id", updateRegistro); // Actualizar un registro
router.delete("/registros/:id", deleteRegistro); // Eliminar un registro

export default router;