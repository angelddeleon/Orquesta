const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario.js");
const process = require("process");

const crearUsuario = async (req, res) => {
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
const login = async (req, res) => {
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
const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar un usuario
const eliminarUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    await Usuario.destroy({ where: { id } });
    res.json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Verificar token
const verifyToken = (req, res) => {
  const token = req.cookies.token;

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
const logout = (req, res) => {
  try {
    res.clearCookie("token");
    res.json({ message: "Sesión cerrada correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error al cerrar sesión" });
  }
};

// Editar un usuario
const editarUsuario = async (req, res) => {
  const { id } = req.params;
  // Asegúrate de que 'contraseña' se extrae del body
  const { nombre, email, telefono, contraseña, role } = req.body; 

  try {
    // Buscar el usuario por ID
    const usuario = await Usuario.findByPk(id);
    
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Permiso: Un 'master' no puede ser editado por un 'admin'
    // Asumo que tu lógica de roles ya maneja quién puede editar a quién.
    // Si el usuario actual es un 'admin' y el usuario a editar es 'master', denegar.
    // Esto es un ejemplo, ajusta según tu control de acceso.
    if (usuario.role === 'master' && req.user.role !== 'master') { // req.user.role vendría del middleware de autenticación
        return res.status(403).json({ error: "No tienes permisos para editar este usuario." });
    }
    // Si el usuario a editar es el mismo que el usuario autenticado (si tienes esa lógica)
    // y quieres impedir la auto-edición de ciertos campos, puedes añadirla aquí.

    // Actualizar los campos del usuario
    usuario.nombre = nombre || usuario.nombre;
    usuario.email = email || usuario.email;
    usuario.telefono = telefono || usuario.telefono;
    
    // *** CAMBIO CLAVE AQUÍ: Hashear la contraseña si se proporcionó una nueva ***
    if (contraseña) { // Solo si se envió una contraseña en la solicitud
      const hashedPassword = await bcrypt.hash(contraseña, 10);
      usuario.contraseña = hashedPassword;
    }
    
    // Solo actualizar el rol si se envió y si el usuario autenticado tiene permiso para cambiar roles
    // Por ejemplo, solo un 'master' podría cambiar roles.
    if (role && (req.user && req.user.role === 'master')) { // Asumiendo que req.user tiene el rol del usuario autenticado
        usuario.role = role;
    } else if (role && usuario.role !== role) { // Si el rol es diferente y no es master, quizás denegar
        // Opcional: Manejar si un admin intenta cambiar el rol de un usuario.
        // Por ejemplo, un admin no debería poder degradarse o promoverse a sí mismo o a otros admins/masters.
    }


    // Guardar los cambios
    await usuario.save();

    console.log("Usuario actualizado:", usuario);

    res.json({ 
      message: "Usuario actualizado exitosamente",
      user: { // Opcional: devolver los datos actualizados del usuario (sin contraseña hasheada)
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        telefono: usuario.telefono,
        role: usuario.role
      }
    });
  } catch (error) {
    console.error("Error al editar usuario:", error); // Mejorar el log del error
    res.status(400).json({ error: error.message });
  }
};

// Obtener un usuario por su ID
const obtenerUsuarioPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await Usuario.findByPk(id);
    
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Devuelve los datos del usuario sin información sensible (como la contraseña)
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

module.exports = {
  crearUsuario,
  login,
  obtenerUsuarios,
  eliminarUsuario,
  verifyToken,
  logout,
  editarUsuario,
  obtenerUsuarioPorId
};