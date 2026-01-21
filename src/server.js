const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connectDB, closeDB } = require('./config/database');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const app = express();
const PORT = process.env.PORT || 3000;
const authRoutes = require('./routes/authRoutes');
const todosRoutes = require('./routes/todosRoutes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());


const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, 
  max: 10, 
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: { message: 'Demasiadas solicitudes, inténtalo más tarde', code: 'TOO_MANY_REQUESTS' } }
});


app.get('/', (req, res) => {
  res.json({ message: 'API de Todolist UTN' });
});


app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/todos", todosRoutes);


app.use((err, req, res, next) => {
  console.error(err && err.stack ? err.stack : err);
  res.status(500).json({ success: false, error: { message: 'Algo salió mal!', code: 'INTERNAL_ERROR' } });
});


async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo... `);
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
