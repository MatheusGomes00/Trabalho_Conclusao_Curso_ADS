import mongoose from 'mongoose';

const documentoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
    unique: true, // Cada usuário só pode ter 1 conjunto de documentos
  },
  docsEnviados: {
    type: Boolean,
    default: false,
  },
  docsValidados: {
    type: Boolean,
    default: false,
  },
  refDocFrente: {
    type: String, // Pode ser caminho do arquivo ou URL
  },
  refDocVerso: {
    type: String,
  },
  refSelfie: {
    type: String,
  },
  criadoEm: {
    type: Date,
    default: Date.now,
  },
  validadoEm: {
    type: Date,
  },
});

export default mongoose.model('Documento', documentoSchema);
