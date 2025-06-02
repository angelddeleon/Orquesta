const express = require('express');
const sequelize = require('./config/db');
const loadInitialData = require('./config/initialData');

const app = express();

// ... other middleware and route configurations ...

// Sync database and load initial data
sequelize.sync({ force: false }).then(async () => {
  try {
    console.log('🗄️ Base de datos sincronizada');
    await loadInitialData();
    console.log('📚 Datos iniciales cargados correctamente');
  } catch (error) {
    console.error('❌ Error cargando datos iniciales:', error);
  }
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  });
}).catch(error => {
  console.error('❌ Error sincronizando la base de datos:', error);
});

// ... rest of your server code ... 