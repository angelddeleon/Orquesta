const express = require("express");
const {
    obtenerPrestamos,
    crearPrestamo,
    editarPrestamo,
    obtenerPrestamoPorId,
    eliminarPrestamo,
    cambiarEstadoPrestamo
} = require("../../controllers/prestamo.controller.js");

const router = express.Router();

router.get("/", obtenerPrestamos);
router.post("/", crearPrestamo);
router.put("/:id", editarPrestamo);
router.get("/:id", obtenerPrestamoPorId);
router.delete("/:id", eliminarPrestamo);
router.put("/:id/estado", cambiarEstadoPrestamo);

module.exports = router;
