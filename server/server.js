const app = require("./app.js");
const process = require("process");
const sequelize = require("./config/db.js");
const loadInitialData = require("./config/initialData.js");

const PORT = process.env.PORT || 3000;

// Configuración robusta de Sequelize
sequelize.options = {
  ...sequelize.options,
  logging: false, // Desactiva logs para producción
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  retry: {
    max: 3, // Intentar reconectar 3 veces
    timeout: 60000 // 1 minuto entre intentos
  }
};

const startServer = async () => {
  try {
    console.log("Iniciando servidor...");
    
    // Conexión con manejo de errores mejorado
    await sequelize.authenticate();
    console.log("✅ Conexión a BD exitosa");

    // Sincronización segura
    console.log("Sincronizando modelos...");
    await sequelize.sync({ 
      force: false,
      alter: false
    });
    console.log("Modelos sincronizados correctamente");

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor iniciado en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("⛔ Error crítico al iniciar servidor:", error);
    process.exit(1);
  }
};

// Manejo de señales mejorado
const shutdown = async () => {
  console.log('\nApagando servidor...');
  try {
    await sequelize.close();
    console.log('Conexiones cerradas correctamente');
    process.exit(0);
  } catch (err) {
    console.error('Error al cerrar conexiones:', err);
    process.exit(1);
  }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

startServer();