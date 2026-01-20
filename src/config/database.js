const mongoose = require('mongoose');
require('dotenv').config();

const DB_NAME = process.env.DB_NAME || 'todolist';
const defaultUri = `mongodb+srv://${process.env.DB_USER || 'valentin_ruggieri'}:${process.env.DB_PASSWORD || '<db_password>'}@cluster0.fvszfhb.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
const MONGODB_URI = process.env.MONGODB_URI || defaultUri;

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);

    console.log('✅ Conectado a MongoDB (mongoose)');
    return mongoose.connection;
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error);
    throw error;
  }
}

async function closeDB() {
  try {
    await mongoose.disconnect();
    console.log('🔌 Conexión a MongoDB cerrada');
  } catch (error) {
    console.error('❌ Error al cerrar la conexión a MongoDB:', error);
    throw error;
  }
}

module.exports = {
  connectDB,
  closeDB,
  mongoose,
};
