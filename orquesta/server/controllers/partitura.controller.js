import db from "../config/db.js";
import { Op } from "sequelize";
import models from "../models/index.js"; // Ruta correcta a tu index de modelos
const { Partitura, Instrumento, Instrumento_Original, Instrumento_Copia } =
  models;

// Helper para procesar arrays
const processArray = (arr) => arr?.join("; ") || null;

// Añade este helper al inicio del archivo
const normalizarNombre = (nombre) => {
  if (!nombre) throw new Error("Nombre de instrumento requerido");
  return nombre.trim().toLowerCase();
};

export const obtenerPartituras = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;

    // Filtros básicos
    const { obra, archivero, categoria, score, observaciones, caja } =
      req.query;

    const compositores = req.query.compositores
      ? req.query.compositores.split(";")
      : [];
    const arreglistas = req.query.arreglistas
      ? req.query.arreglistas.split(";")
      : [];
    const orquestaciones = req.query.orquestaciones
      ? req.query.orquestaciones.split(";")
      : [];

    // Construir el objeto where principal
    const whereClause = {};
    if (obra) {
      whereClause.obra = { [Op.like]: `%${obra.toLowerCase()}%` }; // Usar toLowerCase() si es necesario
    }
    if (archivero) {
      whereClause.archivero = { [Op.like]: `%${archivero.toLowerCase()}%` };
    }
    if (categoria) {
      whereClause.categoria = categoria;
    }
    if (observaciones) {
      whereClause.observaciones = {
        [Op.like]: `%${observaciones.toLowerCase()}%`,
      };
    }
    if (score) {
      whereClause.score = score === "si";
    }
    if (caja) {
      whereClause.caja = {
        [Op.like]: `%${caja.toLowerCase()}%`,
      };
    }
    if (compositores.length > 0 && compositores[0]) {
      whereClause.compositor = {
        [Op.or]: compositores.map((c) => ({
          [Op.like]: `%${c.toLowerCase()}%`,
        })),
      };
    }
    if (arreglistas.length > 0 && arreglistas[0]) {
      whereClause.arreglista = {
        [Op.or]: arreglistas.map((a) => ({
          [Op.like]: `%${a.toLowerCase()}%`,
        })),
      };
    }
    if (orquestaciones.length > 0 && orquestaciones[0]) {
      whereClause.orquestacion = {
        [Op.or]: orquestaciones.map((o) => ({
          [Op.like]: `%${o.toLowerCase()}%`,
        })),
      };
    }

    const { count, rows } = await Partitura.findAndCountAll({
      offset,
      limit: pageSize,
      where: whereClause,
      include: [
        {
          model: Instrumento_Original,
          as: "instrumentos_originales",
          include: [{ model: Instrumento, as: "instrumento" }],
        },
        {
          model: Instrumento_Copia,
          as: "instrumentos_copias",
          include: [{ model: Instrumento, as: "instrumento" }],
        },
      ],
      order: [["createdAt", "DESC"]],
      distinct: true,
    });

    const formatted = rows.map((partitura) => ({
      ...partitura.get({ plain: true }),
      instrumentos_originales: partitura.instrumentos_originales.map((io) => ({
        id: io.instrumento.id,
        nombre: io.instrumento.nombre,
        cantidad: io.cantidad,
      })),
      instrumentos_copias: partitura.instrumentos_copias.map((ic) => ({
        id: ic.instrumento.id,
        nombre: ic.instrumento.nombre,
        cantidad: ic.cantidad,
      })),
    }));

    res.json({
      total: count,
      paginas: Math.ceil(count / pageSize),
      paginaActual: page,
      partituras: formatted,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const obtenerPartituraPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const partitura = await Partitura.findByPk(id, {
      include: [
        {
          model: Instrumento_Original,
          as: "instrumentos_originales",
          include: [
            {
              model: Instrumento,
              as: "instrumento",
              required: false,
            },
          ],
        },
        {
          model: Instrumento_Copia,
          as: "instrumentos_copias",
          include: [
            {
              model: Instrumento,
              as: "instrumento",
              required: false,
            },
          ],
        },
      ],
    });

    if (!partitura) {
      return res.status(404).json({ error: "Partitura no encontrada" });
    }

    // Formatear la respuesta
    const formatted = {
      ...partitura.get({ plain: true }),
      Compositores: partitura.compositor
        ? partitura.compositor.split("; ")
        : [],
      Arreglistas: partitura.arreglista ? partitura.arreglista.split("; ") : [],
      Orquestacion: partitura.orquestacion
        ? partitura.orquestacion.split("; ")
        : [],
      Instrumento: {
        Original: partitura.instrumentos_originales.map((io) => ({
          id: io.instrumento.id,
          Nombre: io.instrumento.nombre,
          Cantidad: io.cantidad,
        })),
        Copia: partitura.instrumentos_copias.map((ic) => ({
          id: ic.instrumento.id,
          Nombre: ic.instrumento.nombre,
          Cantidad: ic.cantidad,
        })),
      },
    };

    // Eliminar campos originales
    delete formatted.compositor;
    delete formatted.arreglista;
    delete formatted.orquestacion;
    delete formatted.instrumentos_originales;
    delete formatted.instrumentos_copias;

    res.json(formatted);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const crearPartitura = async (req, res) => {
  const transaction = await db.transaction();
  try {
    const { body } = req;
    // Crear la partitura
    const nuevaPartitura = await Partitura.create(
      {
        obra: body.Obra,
        archivero: body.Archivero,
        caja: body.Caja,
        sede: body.Sede,
        compositor: processArray(body.Compositores),
        arreglista: processArray(body.Arreglistas),
        orquestacion: processArray(body.Orquestacion),
        formato: body.Formato,
        categoria: body.Categoria,
        score: body.Score === "true",
        observaciones: body.Observaciones,
      },
      { transaction }
    );

    // Procesar instrumentos
    const procesarInstrumentos = async (instrumentos, tipo) => {
      for (const instrumento of instrumentos) {
        const [inst] = await Instrumento.findOrCreate({
          where: { nombre: instrumento.Nombre },
          defaults: { nombre: instrumento.Nombre },
          transaction,
        });

        const model =
          tipo === "Original" ? Instrumento_Original : Instrumento_Copia;
        await model.create(
          {
            id_instrumento: inst.id,
            id_partitura: nuevaPartitura.id,
            cantidad: parseInt(instrumento.Cantidad) || 0,
          },
          { transaction }
        );
      }
    };

    if (body.Instrumentos?.Original)
      await procesarInstrumentos(
        body.Instrumentos.Original,
        "Original",
        transaction,
        nuevaPartitura.id
      );

    if (body.Instrumentos?.Copia)
      await procesarInstrumentos(
        body.Instrumentos.Copia,
        "Copia",
        transaction,
        nuevaPartitura.id
      );

    await transaction.commit();
    res.status(201).json(nuevaPartitura);
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    res.status(400).json({ error: error.message });
  }
};

export const modificarPartitura = async (req, res) => {
  const transaction = await db.transaction();
  try {
    const { id } = req.params;
    const { body } = req;
    // Buscar partitura
    const partitura = await Partitura.findByPk(id, { transaction });
    if (!partitura)
      return res.status(404).json({ error: "Partitura no encontrada" });

    // Actualizar campos permitidos
    const camposPermitidos = [
      "Obra",
      "Archivero",
      "Caja",
      "Sede",
      "Formato",
      "Categoria",
      "Score",
      "Observaciones",
    ];

    const updates = {};
    camposPermitidos.forEach((campo) => {
      if (body[campo] !== undefined) updates[campo.toLowerCase()] = body[campo];
    });

    // Procesar arrays
    if (body.Compositores) updates.compositor = processArray(body.Compositores);
    if (body.Arreglistas) updates.arreglista = processArray(body.Arreglistas);
    if (body.Orquestacion)
      updates.orquestacion = processArray(body.Orquestacion);

    await partitura.update(updates, { transaction });

    // Procesar instrumentos si vienen en el body
    if (body.Instrumentos) {
      // Eliminar relaciones existentes
      await Instrumento_Original.destroy({
        where: { id_partitura: id },
        transaction,
      });
      await Instrumento_Copia.destroy({
        where: { id_partitura: id },
        transaction,
      });

      // Crear nuevas relaciones
      const procesarInstrumentos = async (instrumentos, tipo) => {
        for (const instrumento of instrumentos) {
          const [inst] = await Instrumento.findOrCreate({
            where: { nombre: instrumento.Nombre },
            defaults: { nombre: instrumento.Nombre },
            transaction,
          });

          const model =
            tipo === "Original" ? Instrumento_Original : Instrumento_Copia;
          await model.create(
            {
              id_instrumento: inst.id,
              id_partitura: id,
              cantidad: parseInt(instrumento.Cantidad) || 0,
            },
            { transaction }
          );
        }
      };

      if (body.Instrumentos.Original)
        await procesarInstrumentos(
          body.Instrumentos.Original,
          "Original",
          transaction,
          id
        );

      if (body.Instrumentos.Copia)
        await procesarInstrumentos(
          body.Instrumentos.Copia,
          "Copia",
          transaction,
          id
        );
    }

    await transaction.commit();
    res.json(partitura);
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    res.status(400).json({ error: error.message });
  }
};

export const obtenerTodasLasPartituras = async (req, res) => {
  try {
    /*
      PARA EL PDF Y OBTENER TODAS LAS PARTITURAS
    */
    res.status(200).json(await Partitura.findAll());
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const obtenerTodasPartiturasConInstrumentos = async (req, res) => {
  try {
    // Obtener todas las partituras con sus relaciones
    const partituras = await Partitura.findAll({
      include: [
        {
          model: Instrumento_Original,
          as: "instrumentos_originales",
          include: [{ 
            model: Instrumento, 
            as: "instrumento",
            attributes: ['id', 'nombre'] 
          }],
          attributes: ['id', 'cantidad']
        },
        {
          model: Instrumento_Copia,
          as: "instrumentos_copias",
          include: [{ 
            model: Instrumento, 
            as: "instrumento",
            attributes: ['id', 'nombre'] 
          }],
          attributes: ['id', 'cantidad']
        }
      ],
      order: [['obra', 'ASC']] // Ordenar alfabéticamente por nombre de obra
    });

    // Formatear la respuesta para simplificar la estructura
    const partiturasFormateadas = partituras.map(partitura => {
      const partituraPlain = partitura.get({ plain: true });
      
      return {
        id: partituraPlain.id,
        obra: partituraPlain.obra,
        archivero: partituraPlain.archivero,
        caja: partituraPlain.caja,
        sede: partituraPlain.sede,
        compositores: partituraPlain.compositor ? partituraPlain.compositor.split('; ') : [],
        arreglistas: partituraPlain.arreglista ? partituraPlain.arreglista.split('; ') : [],
        orquestacion: partituraPlain.orquestacion ? partituraPlain.orquestacion.split('; ') : [],
        formato: partituraPlain.formato,
        categoria: partituraPlain.categoria,
        score: partituraPlain.score,
        observaciones: partituraPlain.observaciones,
        instrumentos: {
          originales: partituraPlain.instrumentos_originales.map(io => ({
            id: io.instrumento.id,
            nombre: io.instrumento.nombre,
            cantidad: io.cantidad
          })),
          copias: partituraPlain.instrumentos_copias.map(ic => ({
            id: ic.instrumento.id,
            nombre: ic.instrumento.nombre,
            cantidad: ic.cantidad
          }))
        },
        createdAt: partituraPlain.createdAt,
        updatedAt: partituraPlain.updatedAt
      };
    });

    res.json({
      success: true,
      count: partiturasFormateadas.length,
      data: partiturasFormateadas
    });
  } catch (error) {
    console.error('Error al obtener partituras con instrumentos:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener las partituras',
      details: error.message
    });
  }
};