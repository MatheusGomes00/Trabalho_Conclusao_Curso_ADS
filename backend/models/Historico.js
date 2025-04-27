import { Schema, model } from 'mongoose';

const historicoSchema = new Schema({
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  servico: {
    type: Schema.Types.ObjectId,
    ref: 'Servico',
    required: true,
  },
  tipoAcao: {
    type: String,
    enum: ['publicado', 'aceito', 'concluido', 'cancelado'],
    required: true,
  },
  data: {
    type: Date,
    default: Date.now,
  },
});

export default model('Historico', historicoSchema);