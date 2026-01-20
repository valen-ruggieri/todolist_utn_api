const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connectDB, closeDB } = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.get('/', (req, res) => {
  res.json({ message: 'API de Todolist UTN' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal!' });
});

app.use("/api/users", userRoutes);


async function startServer() {
  try {

    await connectDB();
    

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}


process.on('SIGINT', async () => {
  console.log('\n🛑 Cerrando servidor...');
  await closeDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Cerrando servidor...');
  await closeDB();
  process.exit(0);
});

startServer();
