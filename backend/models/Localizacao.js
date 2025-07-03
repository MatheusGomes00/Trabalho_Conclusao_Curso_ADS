// tg-master/backend/models/Localizacao.js
import mongoose from 'mongoose';

const LocalizacaoSchema = new mongoose.Schema({
  servicoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Servico', required: true, unique: true },    
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  atualizadoEm: { type: Date, default: Date.now }
});

export default mongoose.model('Localizacao', LocalizacaoSchema);
