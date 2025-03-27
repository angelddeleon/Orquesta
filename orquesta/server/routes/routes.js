import { Router } from "express";

import partituraRouter from "./partituras/partituraRouter.js";
import { obtenerInstrumentos } from "../controllers/instrumento.controller.js";
import usuarioRouter from "./usuarios/usuarioRouter.js";
import prestamoRouter from "./prestamos/prestamoRouter.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = Router();

// Rutas para registros

// USUARIO
//Iniciar Sesion

// Rutas para partituras
router.use("/partituras", partituraRouter);
router.get("/instrumentos", obtenerInstrumentos);
router.use("/usuarios", usuarioRouter)
router.use("/prestamos", prestamoRouter)

export default router;
