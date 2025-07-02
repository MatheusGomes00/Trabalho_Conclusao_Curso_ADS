import { Schema, model } from 'mongoose';

const servicoSchema = new Schema({
  cliente: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  clienteNome: {
    type: String,
    required: false,
  },
  motorista: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    default: null,
  },
  motoristaNome: {
    type: String,
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
    required: false,
  },
  preco: {
    type: Number,
    required: false,
  },
  status: {
    type: String,
    enum: ['aberto', 'aceito', 'em andamento', 'concluido', 'cancelado'],
    default: 'aberto',
  },
  dataCriacao: {
    type: Date,
    default: Date.now,
  },
  dataAgendamento: {
    type: Date,
  },
  dataConclusao: {
    type: Date,
  },
  rejeitadoPor: [{
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    default: [],
  }],
});

export default model('Servico', servicoSchema);
