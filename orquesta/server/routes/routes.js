import { Router } from "express";

import { loginTest } from "../controllers/login.controller.js";

import partituraRouter from "./partituras/partituraRouter.js";

import { obtenerInstrumentos } from "../controllers/instrumento.controller.js";

import usuarioRouter from "./usuarios/usuarioRouter.js";

import prestamoRouter from "./prestamos/prestamoRouter.js";

const router = Router();

// Rutas para registros

// USUARIO
//Iniciar Sesion
//Cambiar el loginTest por loginDB para probar con la base de datos
router.post("/login", loginTest);

// Rutas para partituras
router.use("/partituras", partituraRouter);
router.get("/instrumentos", obtenerInstrumentos);
router.use("/usuarios", usuarioRouter)
router.use("/prestamos", prestamoRouter)

export default router;
