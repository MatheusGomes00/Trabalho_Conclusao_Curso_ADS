import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import usuarioRoutes from './routes/usuarios.js';
import servicoRoutes from './routes/servicos.js';
import contatoRoutes from './routes/contato.js'

dotenv.config();

const app = express();

app.use(cors({
  origin: ['http://localhost:5000', 'http://192.168.100.31:5000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/fretes', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar:', err));

app.use('/api/user', usuarioRoutes);
app.use('/api/servicos', servicoRoutes);
app.use('/api/contato', contatoRoutes)

app.get('/', (req, res) => res.send('API rodando'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));