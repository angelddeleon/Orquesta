const fs = require('fs');
const path = require('path');
const { Partitura, Instrumento, Instrumento_Original, Instrumento_Copia } = require('../models');
const sequelize = require('./db.js');

// Configuración
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

// Normalización de nombres de instrumentos
const normalizeInstrumentName = (name) => {
  return name
    .trim()
    .replace(/\(.*?\)/g, '')
    .replace(/\s+/g, ' ')
    .replace(/ I - II/g, '')
    .replace(/ III - IV/g, '')
    .replace(/ I - I1/g, '')
    .replace(/ III/g, '')
    .replace(/ in [A-Z]/g, '')
    .trim();
};

// Parseo seguro de instrumentos
const parseInstrumentos = (str) => {
  if (!str || str === 'N/A') return [];
  
  try {
    return str.split(';')
      .filter(item => item.trim() !== '')
      .map(item => {
        const match = item.trim().match(/(.*?)\s*\((\d+)\)/);
        return match 
          ? { name: match[1].trim(), quantity: parseInt(match[2], 10) }
          : { name: item.trim(), quantity: 1 };
      });
  } catch (error) {
    console.error(`Error parseando instrumentos: "${str}"`, error);
    return [];
  }
};

// Función con reintentos para operaciones de BD
const withRetries = async (fn, context, maxRetries = MAX_RETRIES) => {
  let retries = maxRetries;
  while (retries > 0) {
    try {
      return await fn();
    } catch (error) {
      retries--;
      if (retries === 0) {
        console.error(`⛔ Fallo después de ${maxRetries} intentos en ${context}`, error);
        throw error;
      }
      console.warn(`⚠️ Reintentando ${context} (${retries} intentos restantes)...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    }
  }
};

// Carga principal de datos
const loadInitialData = async () => {
  try {
    const filePath = path.join(__dirname, '../data/partituras.json');
    const rawData = fs.readFileSync(filePath, 'utf8');
    const partiturasData = JSON.parse(rawData);

    // Procesar partituras en serie con manejo individual
    for (const partituraData of partiturasData) {
      await withRetries(async () => {
        const transaction = await sequelize.transaction();
        
        try {
          // Crear partitura
          const [partitura, created] = await Partitura.findOrCreate({
            where: { obra: partituraData.Obra },
            defaults: {
              obra: partituraData.Obra,
              caja: partituraData.CAJA,
              compositor: partituraData.Author !== 'N/A' ? partituraData.Author : null,
              arreglista: partituraData.Arreglista !== 'N/A' ? partituraData.Arreglista : null,
              orquestacion: partituraData.Orquestacion !== 'N/A' ? partituraData.Orquestacion : null,
              score: partituraData.Score === 'YES',
              observaciones: partituraData.Observacion !== 'N/A' ? partituraData.Observacion : null,
              archivista: 'Sistema',
              sede: 'Principal',
              categoria: 'Orquestal',
              formato: 'Papel'
            },
            transaction
          });

          // Procesar instrumentos originales
          if (partituraData['Cantidad (Original)'] && partituraData['Cantidad (Original)'] !== 'N/A') {
            await processInstruments(
              partituraData['Cantidad (Original)'],
              partitura,
              Instrumento_Original,
              transaction
            );
          }

          // Procesar instrumentos copia
          if (partituraData['Cantidad (Copia)'] && partituraData['Cantidad (Copia)'] !== 'N/A') {
            await processInstruments(
              partituraData['Cantidad (Copia)'],
              partitura,
              Instrumento_Copia,
              transaction
            );
          }

          await transaction.commit();
          console.log(`✅ Partitura "${partituraData.Obra}" procesada correctamente`);
        } catch (error) {
          if (transaction.finished !== 'commit') {
            await transaction.rollback().catch(e => {
              console.error('⚠️ Error en rollback:', e.message);
            });
          }
          throw error;
        }
      }, `procesando partitura "${partituraData.Obra}"`);
    }

    console.log('🎉 Todos los datos cargados exitosamente');
  } catch (error) {
    console.error('❌ Error fatal en carga inicial:', error);
    throw error;
  }
};

// Procesamiento de instrumentos
async function processInstruments(instrumentString, partitura, Model, transaction) {
  const instruments = parseInstrumentos(instrumentString);
  
  for (const instr of instruments) {
    await withRetries(async () => {
      const normalizedName = normalizeInstrumentName(instr.name);
      
      const [instrumento] = await Instrumento.findOrCreate({
        where: { nombre: normalizedName },
        defaults: { nombre: normalizedName },
        transaction
      });

      await Model.create({
        id_instrumento: instrumento.id,
        id_partitura: partitura.id,
        cantidad: instr.quantity
      }, { transaction });
    }, `procesando instrumento ${instr.name}`);
  }
}

module.exports = loadInitialData;