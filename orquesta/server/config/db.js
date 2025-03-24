// import mysql from "mysql2/promise";
import dotenv from "dotenv";
import process from "process";
import { Sequelize } from "sequelize";

dotenv.config();

// const db = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
// });

const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    logging: true, // Cambiar a false en producción TODO: Crear variable de entorno
    dialect: "mysql",
    port: process.env.DB_PORT || 3306,
  }
);

// Verificar conexión
db.authenticate()
  .then(() => db.sync({ alter: true }), console.log("✅ Conexión a BD exitosa"))
  .catch((error) => console.error("❌ Error de conexión:", error));

export default db;
