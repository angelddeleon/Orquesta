import { Router } from "express";
import {
    getRegistros,
    getRegistroById,
    createRegistro,
    updateRegistro,
    deleteRegistro,
} from "../controllers/registroController.js";

import { loginTest } from "../controllers/login.controller.js";

import partituraRouter from "./partituras/partituraRouter.js";
import usuarioRouter from "./usuarios/usuarioRouter.js";
const router = Router();

// Rutas para registros

// USUARIO
//Iniciar Sesion
//Cambiar el loginTest por loginDB para probar con la base de datos
router.post("/login", loginTest);

router.get("/registros", getRegistros); // Obtener todos los registros (con paginación)
router.get("/registros/:id", getRegistroById); // Obtener un registro por ID
router.post("/registros", createRegistro); // Crear un nuevo registro
router.put("/registros/:id", updateRegistro); // Actualizar un registro
router.delete("/registros/:id", deleteRegistro); // Eliminar un registro

// Rutas para partituras
router.use("/partituras", partituraRouter);
router.use("/usuarios", usuarioRouter)

export default router;