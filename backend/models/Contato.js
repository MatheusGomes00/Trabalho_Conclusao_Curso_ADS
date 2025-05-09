import { Schema, model } from 'mongoose';

const contatoSchema = new Schema({
  cliente: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  motorista: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    require: false,
    default: null,
  },
  servico: {
    type: Schema.Types.ObjectId,
    ref: 'Servico',
    require: true,
  },
  dataContato: {
    type: Date,
    default: Date.now,
  },

})

export default model('Contato', contatoSchema);
