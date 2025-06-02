const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
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

// Función para guardar partituras fallidas
const saveFailedPartituras = (failedPartituras) => {
  const filePath = path.join(__dirname, '../data/faltantes.json');
  try {
    fs.writeFileSync(filePath, JSON.stringify(failedPartituras, null, 2));
    console.log(`📝 Se guardaron ${failedPartituras.length} partituras fallidas en faltantes.json`);
  } catch (error) {
    console.error('❌ Error al guardar partituras fallidas:', error);
  }
};

// Función para validar y normalizar el nombre del compositor
const normalizeComposerName = (composer) => {
  if (!composer || composer === 'N/A' || composer === '') {
    return 'N/A';
  }
  return composer.trim();
};

// Carga principal de datos
const loadInitialData = async () => {
  const failedPartituras = [];
  let totalProcessed = 0;
  let totalFailed = 0;
  const composers = new Set();
  
  try {
    const filePath = path.join(__dirname, '../data/partituras.xlsx');
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const partiturasData = XLSX.utils.sheet_to_json(worksheet);
    const totalPartituras = partiturasData.length;

    console.log(`\n📚 Iniciando procesamiento de ${totalPartituras} partituras desde Excel...\n`);

    // Procesar partituras en serie con manejo individual
    for (const partituraData of partiturasData) {
      try {
        await withRetries(async () => {
          const transaction = await sequelize.transaction();
          
          try {
            const composerName = normalizeComposerName(partituraData.Autor);
            composers.add(composerName);

            // Verificar si la partitura ya existe
            const existingPartitura = await Partitura.findOne({
              where: { obra: partituraData.Obra },
              transaction
            });

            const partituraInfo = {
              obra: partituraData.Obra,
              caja: partituraData.CAJA,
              compositor: composerName,
              arreglista: partituraData.Arreglista !== 'N/A' ? partituraData.Arreglista : null,
              orquestacion: partituraData.Orquestacion !== 'N/A' ? partituraData.Orquestacion : null,
              score: partituraData.Score === 'YES',
              observaciones: partituraData.Observacion !== 'N/A' ? partituraData.Observacion : null,
              archivista: 'Sistema',
              sede: 'Av. Bolivar',
              categoria: 'Orquestal',
              formato: 'Papel'
            };

            if (existingPartitura) {
              console.log(`📝 Actualizando partitura: "${partituraData.Obra}"`);
              console.log(`   Compositor: ${composerName}`);
              
              // Actualizar datos de la partitura existente
              await existingPartitura.update(partituraInfo, { transaction });

              // Eliminar instrumentos existentes
              await Instrumento_Original.destroy({
                where: { id_partitura: existingPartitura.id },
                transaction
              });
              await Instrumento_Copia.destroy({
                where: { id_partitura: existingPartitura.id },
                transaction
              });
            } else {
              console.log(`➕ Nueva partitura: "${partituraData.Obra}"`);
              console.log(`   Compositor: ${composerName}`);
              
              // Crear nueva partitura
              await Partitura.create(partituraInfo, { transaction });
            }

            // Obtener la partitura (nueva o existente)
            const partitura = await Partitura.findOne({
              where: { obra: partituraData.Obra },
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
            totalProcessed++;
            console.log(`✅ Procesada correctamente (${totalProcessed}/${totalPartituras})\n`);
          } catch (error) {
            if (transaction.finished !== 'commit') {
              await transaction.rollback().catch(e => {
                console.error('⚠️ Error en rollback:', e.message);
              });
            }
            throw error;
          }
        }, `procesando partitura "${partituraData.Obra}"`);
      } catch (error) {
        console.error(`❌ Error procesando partitura "${partituraData.Obra}":`, error.message);
        failedPartituras.push({
          ...partituraData,
          error: error.message
        });
        totalFailed++;
      }
    }

    // Guardar partituras fallidas
    if (failedPartituras.length > 0) {
      saveFailedPartituras(failedPartituras);
    }

    console.log('\n🎼 Resumen de Compositores:');
    console.log('------------------------');
    Array.from(composers).sort().forEach(composer => {
      console.log(`• ${composer}`);
    });
    console.log('\n🎉 Procesamiento completado:');
    console.log(`   - Total partituras: ${totalPartituras}`);
    console.log(`   - Procesadas exitosamente: ${totalProcessed}`);
    console.log(`   - Fallidas: ${totalFailed}`);
    if (totalFailed > 0) {
      console.log(`   - Las partituras fallidas se guardaron en faltantes.json`);
    }
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