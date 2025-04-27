import { Schema, model } from 'mongoose';

const servicoSchema = new Schema({
  cliente: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  motorista: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    default: null,
  },
  origem: {
    cidade: String,
    estado: String,
    endereco: String,
  },
  destino: {
    cidade: String,
    estado: String,
    endereco: String,
  },
  tipoCarga: {
    type: String,
    enum: ['mudanca', 'entrega', 'outro'],
    required: true,
  },
  pesoEstimado: {
    type: Number,
    required: true,
  },
  preco: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['aberto', 'aceito', 'em_andamento', 'concluido', 'cancelado'],
    default: 'aberto',
  },
  dataCriacao: {
    type: Date,
    default: Date.now,
  },
  dataConclusao: {
    type: Date,
  },
});

export default model('Servico', servicoSchema);