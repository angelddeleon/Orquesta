import express from "express";
import {
  crearUsuario,
  obtenerUsuarios,
  eliminarUsuario,
  login,
  verifyToken,
  logout,
  editarUsuario,
  obtenerUsuarioPorId,
  //verifyRole
} from "../../controllers/usuario.controller.js";

import { verifyToken as Verify } from "../../middlewares/verifyToken.js";

const router = express.Router();

router.post("/",Verify, crearUsuario); // Registrar usuario
router.post("/login", login); // Login de usuario
router.post("/logout",Verify, logout); // Logout de usuario
router.get("/",Verify, obtenerUsuarios); // Obtener todos los usuarios
router.delete("/:id",Verify, eliminarUsuario); // Eliminar usuario
router.get("/verificarToken",Verify, verifyToken); // Verificar token
router.put("/:id",Verify, editarUsuario) // Editar usuario
router.get("/:id",Verify, obtenerUsuarioPorId) // Obtener usuario por ID
//router.get("/verificarRol",Verify, verifyRole) // Verificar rol de usuario

export default router;
