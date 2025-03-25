import express from "express";
import {
  crearUsuario,
  obtenerUsuarios,
  eliminarUsuario,
  login,
  verifyToken,
  logout,
} from "../../controllers/usuario.controller.js";

const router = express.Router();

router.post("/", crearUsuario); // Registrar usuario
router.post("/login", login); // Login de usuario
router.post("/logout", logout); // Logout de usuario
router.get("/", obtenerUsuarios); // Obtener todos los usuarios
router.delete("/:id", eliminarUsuario); // Eliminar usuario
router.get("/verificarToken", verifyToken); // Verificar token

export default router;
