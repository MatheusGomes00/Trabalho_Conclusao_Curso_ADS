import { Schema, model } from 'mongoose';

const mensagemSchema = new Schema({
  servico: {
    type: Schema.Types.ObjectId,
    ref: 'Servico',
    required: true,
  },
  remetente: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  destinatario: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  conteudo: {
    type: String,
    required: true,
  },
  dataEnvio: {
    type: Date,
    default: Date.now,
  },
});

export default model('Mensagem', mensagemSchema);