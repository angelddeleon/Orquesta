const { Router } = require("express");
const partituraRouter = require("./partituras/partituraRouter.js");
const { obtenerInstrumentos } = require("../controllers/instrumento.controller.js");
const usuarioRouter = require("./usuarios/usuarioRouter.js");
const prestamoRouter = require("./prestamos/prestamoRouter.js");
const { verifyToken: Verify } = require("../middlewares/verifyToken.js");

const router = Router();

// Rutas para registros

// USUARIO
//Iniciar Sesion

// Rutas para partituras
router.use("/partituras", Verify, partituraRouter);
router.get("/instrumentos", Verify, obtenerInstrumentos);
router.use("/usuarios", usuarioRouter);
router.use("/prestamos", Verify, prestamoRouter);

module.exports = router;
