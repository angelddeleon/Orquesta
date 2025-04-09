import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";
import process from "process";

export const crearUsuario = async (req, res) => {
  const { nombre, email, contrasena, role = "archivista", telefono, codigoPais } = req.body;

  if (!contrasena) {
    return res.status(400).json({ error: "La contraseña es obligatoria" });
  }

  try {
    // Verificar si ya existe un usuario con ese correo
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    
    if (usuarioExistente) {
      return res.status(400).json({ error: "Ya existe un usuario registrado con este correo electrónico" });
    }
    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Crear el nuevo usuario en la base de datos usando Sequelize
    const newUser = await Usuario.create({
      nombre,
      email,
      contraseña: hashedPassword,
      role,
      telefono,
      codigoPais
    });

    // Respuesta exitosa con el token
    res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: {
        id: newUser.id,
        nombre: newUser.nombre,
        email: newUser.email,
        role: newUser.role,
        telefono: newUser.telefono,
        codigoPais: newUser.codigoPais
      },
    });
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    res.status(400).json({ error: error.message });
  }
};

// Login de usuario
export const login = async (req, res) => {
  const { email, contraseña } = req.body;

  try {
    const user = await Usuario.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "Usuario no encontrado" });
    }

    if (user.isBlocked) {
      return res.status(400).json({ error: "Usuario bloqueado" });
    }

    const isMatch = await bcrypt.compare(contraseña, user.contraseña);
    if (!isMatch) {
      return res.status(400).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, "secreto", {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 3600000, // 1 hour
      path: "/",
    });

    res.json({
      message: "Login exitoso",
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error en el login:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// Obtener todos los usuarios
export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar un usuario
export const eliminarUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    await Usuario.destroy({ where: { id } });
    res.json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Verificar token
export const verifyToken = (req, res) => {
  const token = req.cookies.token;

  console.log(token);

  if (!token) {
    return res.status(401).json({ error: "No hay token. Inicia sesión" });
  }

  jwt.verify(token, "secreto", (err, decoded) => {
    if (err) {
      res.clearCookie("token");
      return res.status(401).json({ error: "Token inválido" });
    }

    res.json({ message: "Token válido", user: decoded });
  });
};

// Logout
export const logout = (req, res) => {
  try {
    res.clearCookie("token");
    res.json({ message: "Sesión cerrada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al cerrar sesión" });
  }
};

// Editar un usuario
export const editarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, email, telefono, contraseña, role } = req.body;

  try {
    // Buscar el usuario por ID
    const usuario = await Usuario.findByPk(id);
    
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    if(usuario.role === 'admin'){
      return res.status(403).json({ error: "No tienes permisos para editar este usuario "});
    }

    // Actualizar los campos del usuario
    usuario.nombre = nombre || usuario.nombre;
    usuario.email = email || usuario.email;
    usuario.telefono = telefono || usuario.telefono;
    
    // Solo actualizar la contraseña si se proporcionó una nueva
    if (contraseña) {
      usuario.contraseña = contraseña;
    }
    
    usuario.role = role || usuario.role;

    // Guardar los cambios
    await usuario.save();

    res.json({ 
      message: "Usuario actualizado exitosamente",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener un usuario por su ID
export const obtenerUsuarioPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await Usuario.findByPk(id);
    
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Devuelve los datos del usuario sin información sensible
    res.json({
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      telefono: usuario.telefono,
      codigoPais: usuario.codigoPais,
      role: usuario.role
    });
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};