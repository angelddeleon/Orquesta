import Prestamo from "../models/Prestamo.js";

// Obtener todos los préstamos
export const obtenerPrestamos = async (req, res) => {
  try {
    const prestamos = await Prestamo.findAll({
      order: [['createdAt', 'DESC']] // Ordenar por fecha de creación (más recientes primero)
    });
    res.json(prestamos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Crear un nuevo préstamo
export const crearPrestamo = async (req, res) => {
  const { obra, caja, entrego, recibio, anterior, actual, observaciones } = req.body;

  try {
    const nuevoPrestamo = await Prestamo.create({
      obra,
      caja,
      entrego,
      recibio,
      anterior,
      actual,
      observaciones,
      dia: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
      hora: new Date().toTimeString().split(' ')[0], // Hora actual en formato HH:MM:SS
      estado: 'activo'
    });

    res.status(201).json({
      message: "Préstamo registrado exitosamente",
      prestamo: nuevoPrestamo
    });
  } catch (error) {
    console.error("Error al registrar el préstamo:", error);
    res.status(400).json({ error: error.message });
  }
};

// Editar un préstamo existente
export const editarPrestamo = async (req, res) => {
  const { id } = req.params;
  const { obra, caja, entrego, recibio, anterior, actual, observaciones, estado } = req.body;

  try {
    const prestamo = await Prestamo.findByPk(id);
    
    if (!prestamo) {
      return res.status(404).json({ error: "Préstamo no encontrado" });
    }

    // Actualizar los campos
    prestamo.obra = obra || prestamo.obra;
    prestamo.caja = caja || prestamo.caja;
    prestamo.entrego = entrego || prestamo.entrego;
    prestamo.recibio = recibio || prestamo.recibio;
    prestamo.anterior = anterior || prestamo.anterior;
    prestamo.actual = actual || prestamo.actual;
    prestamo.observaciones = observaciones || prestamo.observaciones;
    prestamo.estado = estado || prestamo.estado;

    await prestamo.save();

    res.json({ 
      message: "Préstamo actualizado exitosamente",
      prestamo
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener un préstamo por su ID
export const obtenerPrestamoPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const prestamo = await Prestamo.findByPk(id);
    
    if (!prestamo) {
      return res.status(404).json({ error: "Préstamo no encontrado" });
    }

    res.json(prestamo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar un préstamo (borrado lógico si tienes paranoid: true)
export const eliminarPrestamo = async (req, res) => {
  const { id } = req.params;

  try {
    const prestamo = await Prestamo.findByPk(id);
    
    if (!prestamo) {
      return res.status(404).json({ error: "Préstamo no encontrado" });
    }

    await prestamo.destroy();
    res.json({ message: "Préstamo eliminado exitosamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Cambiar estado de un préstamo (ej: marcar como devuelto)
export const cambiarEstadoPrestamo = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    const prestamo = await Prestamo.findByPk(id);
    
    if (!prestamo) {
      return res.status(404).json({ error: "Préstamo no encontrado" });
    }

    prestamo.estado = estado;
    await prestamo.save();

    res.json({ 
      message: `Préstamo marcado como ${estado}`,
      prestamo
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};