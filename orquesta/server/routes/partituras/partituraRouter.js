// routes/partituraRoutes.js
import express from "express";
import {
  obtenerPartituras,
  crearPartitura,
  obtenerPartituraPorId,
  modificarPartitura,
} from "../../controllers/partitura.controller.js";

const partituraRouter = express.Router();

// GET /partituras?page=1&pageSize=20
partituraRouter.get("/", obtenerPartituras);

// GET /partituras/:id
partituraRouter.get("/:id", obtenerPartituraPorId);

// POST /partituras
partituraRouter.post("/", crearPartitura);

// PUT /partituras/:id
partituraRouter.put("/:id", modificarPartitura);

export default partituraRouter;
