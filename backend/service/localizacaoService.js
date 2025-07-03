// tg-master/backend/service/localizacaoService.js
import Localizacao from '../models/Localizacao.js';

export async function atualizarLocalizacao(req, res) {
  try {
    const { servicoId } = req.params;
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ erro: 'Latitude e longitude são obrigatórios' });
    }

    const localizacaoAtualizada = await Localizacao.findOneAndUpdate(
      { servicoId },
      { latitude, longitude, atualizadoEm: new Date() },
      { new: true, upsert: true }
    );

    res.json(localizacaoAtualizada);
  } catch (error) {
    console.error('Erro ao atualizar localização:', error);
    res.status(500).json({ erro: 'Erro ao atualizar localização' });
  }
}

export async function obterLocalizacao(req, res) {
  try {
    const { servicoId } = req.params;

    const localizacao = await Localizacao.findOne({ servicoId });

    if (!localizacao) {
      return res.status(404).json({ erro: 'Localização não encontrada' });
    }

    res.json({
      latitude: localizacao.latitude,
      longitude: localizacao.longitude,
      atualizadoEm: localizacao.atualizadoEm,
    });
  } catch (error) {
    console.error('Erro ao obter localização:', error);
    res.status(500).json({ erro: 'Erro ao obter localização' });
  }
}
