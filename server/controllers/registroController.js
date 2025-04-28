const db = require("../config/db.js");

// Obtener todos los registros (con paginación)
const getRegistros = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const [registros] = await db.query(
            "SELECT * FROM registros LIMIT ? OFFSET ?",
            [limit, offset]
        );
        const [total] = await db.query("SELECT COUNT(*) AS total FROM registros");

        res.json({
            data: registros,
            total: total[0].total,
            page,
            limit,
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al obtener los registros" });
    }
};

// Obtener un registro por ID
const getRegistroById = async (req, res) => {
    const { id } = req.params;

    try {
        const [registro] = await db.query(
            "SELECT * FROM registros WHERE id = ?",
            [id]
        );

        if (registro.length === 0) {
            return res.status(404).json({ message: "Registro no encontrado" });
        }

        res.json(registro[0]);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al obtener el registro" });
    }
};

// Crear un nuevo registro
const createRegistro = async (req, res) => {
    const { nombre, descripcion } = req.body;

    if (!nombre || !descripcion) {
        return res.status(400).json({ message: "Nombre y descripción son requeridos" });
    }

    try {
        const [result] = await db.query(
            "INSERT INTO registros (nombre, descripcion) VALUES (?, ?)",
            [nombre, descripcion]
        );

        res.status(201).json({ id: result.insertId, nombre, descripcion });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al crear el registro" });
    }
};

// Actualizar un registro
const updateRegistro = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    if (!nombre || !descripcion) {
        return res.status(400).json({ message: "Nombre y descripción son requeridos" });
    }

    try {
        await db.query(
            "UPDATE registros SET nombre = ?, descripcion = ? WHERE id = ?",
            [nombre, descripcion, id]
        );

        res.json({ id, nombre, descripcion });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al actualizar el registro" });
    }
};

// Eliminar un registro
const deleteRegistro = async (req, res) => {
    const { id } = req.params;

    try {
        await db.query("DELETE FROM registros WHERE id = ?", [id]);
        res.status(204).send();
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al eliminar el registro" });
    }
};

module.exports = {
  getRegistros,
  getRegistroById,
  createRegistro,
  updateRegistro,
  deleteRegistro
};