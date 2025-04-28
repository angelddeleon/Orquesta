// routes/partituraRoutes.js
const express = require("express");
const {
  obtenerPartituras,
  crearPartitura,
  obtenerPartituraPorId,
  modificarPartitura,
  obtenerTodasPartiturasConInstrumentos
} = require("../../controllers/partitura.controller.js");

const partituraRouter = express.Router();

// GET /partituras?page=1&pageSize=20
partituraRouter.get("/", obtenerPartituras);

// GET /partituras/:id
partituraRouter.get("/:id", obtenerPartituraPorId);

// POST /partituras
partituraRouter.post("/", crearPartitura);

// PUT /partituras/:id
partituraRouter.put("/:id", modificarPartitura);

// GET /partituras/all
partituraRouter.patch("/all", obtenerTodasPartiturasConInstrumentos);

module.exports = partituraRouter;
