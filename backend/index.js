import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import usuarioRoutes from './routes/usuarios.js';

dotenv.config();

const app = express();

app.use(cors({
    origin: ['http://localhost:5000', 'http://192.168.100.31:5000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/bancoIfreto', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar:', err));

// Rotas
app.use('/api', usuarioRoutes);

app.get('/', (req, res) => res.send('API rodando'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));