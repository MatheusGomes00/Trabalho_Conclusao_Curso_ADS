import { Schema, model } from 'mongoose';

const usuarioSchema = new Schema({
  nome: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  senha: {
    type: String,
    required: true,
  },
  tipo: {
    type: String,
    enum: ['motorista', 'cliente'],
    required: true,
  },
  telefone: {
    type: String,
    required: true,
  },
  endereco: {
    cidade: String,
    estado: String,
  },
  motoristaDetalhes: {
    cnh: {
      type: String,
      required: function() { return this.tipo === 'motorista'; },
    },
    tipoVeiculo: {
      type: String,
      enum: ['caminhonete', 'van', 'caminhao', 'outro'],
      required: function() { return this.tipo === 'motorista'; },
    },
  },
  criadoEm: {
    type: Date,
    default: Date.now,
  },
});

export default model('Usuario', usuarioSchema);