import Servico from '../models/Servico.js';

export const listarServicos = async (req, res) => {
  try {
    const { tipo, id } = req.user;
    const context = req.params.context

    let servicos;

    if (tipo === 'motorista') {
      if (context === 'disponiveis') {
        // serviços abertos para motorista aceitar
        servicos = await Servico.find({
          status: 'aberto',
          motorista: null,
          rejeitadoPor: { $nin: [id] },
        }).populate('cliente', '_id nome email telefone');
      } else if (context === 'historico') {
        // histórico: serviços aceitos ou em andamento ou concluídos
        servicos = await Servico.find({
          status: { $in: ['aceito', 'em andamento', 'concluido'] },
          motorista: id,
        }).populate('cliente', '_id nome email telefone')
          .populate('motorista', '_id nome email telefone');
      } else {
        // fallback, pode listar todos ou retornar erro
        return res.status(400).json({ erro: 'Contexto inválido' });
      }
    } else if (tipo === 'cliente') {
      // histórico do cliente (pode aproveitar mesmo filtro, sem contexto)
      servicos = await Servico.find({ cliente: id })
        .populate('cliente', '_id nome email telefone')
        .populate('motorista', '_id nome email telefone');
    } else {
      return res.status(403).json({ erro: 'Tipo de usuário inválido' });
    }

    res.json(servicos);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao listar serviços' });
  }
};


export const criarServico = async (req, res) => {
  const { tipo } = req.user;
  if (tipo !== 'cliente') {
    return res.status(403).json({ erro: 'Apenas clientes podem criar serviços' });
  }

  const { origem, destino, tipoCarga, pesoEstimado, preco, dataAgendamento } = req.body;

  try {
    const servico = new Servico({
      cliente: req.user.id,
      origem,
      destino,
      tipoCarga,
      pesoEstimado,
      preco,
      dataAgendamento
    });

    await servico.save();
    res.status(201).json(servico);
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao criar serviço: ' + error.message });
  }
};

export const aceitarServico = async (req, res) => {
  const { tipo, id } = req.user;
  if (tipo !== 'motorista') {
    return res.status(403).json({ erro: 'Apenas motoristas podem aceitar serviços' });
  }

  try {
    const servico = await Servico.findById(req.params.id);
    if (!servico) {
      return res.status(404).json({ erro: 'Serviço não encontrado' });
    }
    if (servico.status !== 'aberto' || servico.motorista) {
      return res.status(400).json({ erro: 'Serviço não está disponível' });
    }

    servico.motorista = id;
    servico.status = 'aceito';
    await servico.save();

    res.json(servico);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao aceitar serviço' });
  }
};

export const rejeitarServico = async (req, res) => {
  const { tipo, id } = req.user;
  if (tipo !== 'motorista') {
    return res.status(403).json({ erro: 'Apenas motoristas podem rejeitar serviços' });
  }

  try {
    const servico = await Servico.findById(req.params.id);
    if (!servico) {
      return res.status(404).json({ erro: 'Serviço não encontrado' });
    }

    if (!['aberto', 'aceito'].includes(servico.status)) {
      return res.status(400).json({ erro: 'Serviço não está disponível para rejeição' });
    }

    if (servico.rejeitadoPor.includes(id)) {
      return res.status(400).json({ erro: 'Serviço já rejeitado por este motorista' });
    }

    if (servico.status === 'aceito') {
      // Para serviços aceitos, redefinir status e limpar motorista
      servico.status = 'aberto';
      servico.motorista = null;
    }

    servico.rejeitadoPor.push(id);
    await servico.save();

    res.json(servico);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao rejeitar serviço: ' + error.message });
  }
};

export const iniciarServico = async (req, res) => {
  const { tipo, id } = req.user;
  if (tipo !== 'motorista') {
    return res.status(403).json({ erro: 'Apenas motoristas podem iniciar serviços' });
  }

  try {
    const servico = await Servico.findById(req.params.id);
    if (!servico) {
      return res.status(404).json({ erro: 'Serviço não encontrado' });
    }
    if (servico.motorista.toString() !== id) {
      return res.status(403).json({ erro: 'Apenas o motorista atribuído pode iniciar o serviço' });
    }
    if (servico.status !== 'aceito') {
      return res.status(400).json({ erro: 'Serviço deve estar aceito para ser iniciado' });
    }

    servico.status = 'em andamento';
    await servico.save();

    res.json(servico);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao iniciar serviço' });
  }
};

export const concluirServico = async (req, res) => {
  const { tipo, id } = req.user;
  if (tipo !== 'motorista') {
    return res.status(403).json({ erro: 'Apenas motoristas podem concluir serviços' });
  }

  try {
    const servico = await Servico.findById(req.params.id);
    if (!servico) {
      return res.status(404).json({ erro: 'Serviço não encontrado' });
    }
    if (servico.motorista.toString() !== id) {
      return res.status(403).json({ erro: 'Apenas o motorista atribuído pode concluir o serviço' });
    }
    if (servico.status !== 'em andamento') {
      return res.status(400).json({ erro: 'Serviço deve estar em andamento para ser concluído' });
    }

    servico.status = 'concluido';
    servico.dataConclusao = new Date();
    await servico.save();

    res.json(servico);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao concluir serviço' });
  }
};

export const cancelarServico = async (req, res) => {
  const { tipo, id } = req.user;
  if (tipo !== 'cliente') {
    return res.status(403).json({ erro: 'Apenas clientes podem cancelar serviços' });
  }

  try {
    const servico = await Servico.findById(req.params.id);
    if (!servico) {
      return res.status(404).json({ erro: 'Serviço não encontrado' });
    }
    if (servico.cliente.toString() !== id) {
      return res.status(403).json({ erro: 'Apenas o cliente que criou o serviço pode cancelá-lo' });
    }
    if (!['aberto', 'aceito'].includes(servico.status)) {
      return res.status(400).json({ erro: 'Serviço não pode ser cancelado neste estado' });
    }

    servico.status = 'cancelado';
    await servico.save();

    res.json(servico);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao cancelar serviço' });
  }
};