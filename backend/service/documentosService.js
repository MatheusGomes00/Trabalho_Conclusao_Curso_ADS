import Documento from '../models/Documentos.js';

export const verificarStatus = async (req, res) => {
  try {
    const doc = await Documento.findOne({ userId: req.user.id });
    res.json({ docsEnviados: doc?.docsEnviados || false });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao consultar status dos documentos' });
  }
}

export const criarDocSchemaParaMotorista = async (userId) => {
  try {
    const novoDoc = new Documento({ userId });
    await novoDoc.save();
    console.log(`Documento criado para motorista ${userId}`);
  } catch (err) {
    console.error('Erro ao criar entrada de documento:', err);
    throw err;
  }
};

export const enviarDocumentos = async (req, res) => {
  try {
    const userId = req.user.id;

    const frente = req.files?.refDocFrente?.[0]?.filename;
    const verso = req.files?.refDocVerso?.[0]?.filename;
    const selfie = req.files?.refSelfie?.[0]?.filename;

    if (!frente || !verso || !selfie) {
      return res.status(400).json({ erro: 'Todos os documentos são obrigatórios' });
    }

    const existente = await Documento.findOne({ userId });

    if (existente) {
      existente.refDocFrente = frente;
      existente.refDocVerso = verso;
      existente.refSelfie = selfie;
      existente.docsEnviados = true;
      existente.docsValidados = false; // aguardando validação
      await existente.save();
    } else {
      await Documento.create({
        userId,
        refDocFrente: frente,
        refDocVerso: verso,
        refSelfie: selfie,
        docsEnviados: true,
        docsValidados: false,
      });
    }

    res.status(200).json({ mensagem: 'Documentos enviados com sucesso.' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao enviar documentos: ' + error.message });
  }
};
