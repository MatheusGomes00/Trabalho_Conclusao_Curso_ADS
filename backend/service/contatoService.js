import Contato from '../models/Contato.js';
import Usuario from '../models/Usuarios.js';
import Servico from '../models/Servico.js';


function formatarNumeroComDDI(numeroRaw) {
  if (!numeroRaw) return null;

  // Remove todos os caracteres que não são números
  let numero = numeroRaw.replace(/\D/g, '');

  // Se já vier com o DDI (ex: 5511999998888), mantém
  if (numero.startsWith('55')) {
    numero = numero;
  } else if (numero.length >= 10 && numero.length <= 11) {
    // Se for número nacional válido, adiciona o DDI +55
    numero = '55' + numero;
  } else {
    throw new Error('Número de telefone inválido ou incompleto.');
  }

  return numero;
}


const criarContato = async ({ iniciadorId, receptorId, servicoId, tipoIniciador }) => {
  let clienteId = null;
  let motoristaId = null;

  if (tipoIniciador === 'cliente') {
    clienteId = iniciadorId;
    motoristaId = receptorId;
  } else if (tipoIniciador === 'motorista') {
    clienteId = receptorId;
    motoristaId = iniciadorId;
  } else {
    throw new Error("Tipo de iniciador inválido. Use 'cliente' ou 'motorista'.");
  }

  // Cria o contato
  const novoContato = await Contato.create({
    cliente: clienteId,
    motorista: motoristaId,
    servico: servicoId
  });

  // Buscar dados da parte que receberá o contato
  const usuarioReceptor = await Usuario.findById(receptorId);
  const servico = await Servico.findById(servicoId);
  if (!usuarioReceptor || !usuarioReceptor.telefone) {
    throw new Error('Usuário receptor não encontrado ou sem número de telefone.');
  }
  if (!servico) {
    throw new Error('Serviço não encontrado.');
  }

  const numero = formatarNumeroComDDI(usuarioReceptor.telefone);
  const mensagem = encodeURIComponent(
    `Olá ${usuarioReceptor.nome}! Estou entrando em contato para falar sobre o frete:\n` +
    `🔹 Origem: ${servico.origem?.endereco}, ${servico.origem?.cidade}/${servico.origem?.estado}\n` +
    `🔹 Destino: ${servico.destino?.endereco}, ${servico.destino?.cidade}/${servico.destino?.estado}\n` +
    `🔹 Tipo de Carga: ${servico.tipoCarga || 'Não informado'}\n` +
    `🔹 Preço: ${servico.preco ? `R$ ${servico.preco.toFixed(2)}` : 'A combinar'}`
  );
  const linkWhatsApp = `https://wa.me/${numero}?text=${mensagem}`;

  return {
    contato: novoContato,
    linkWhatsApp
  };
};

export const iniciarContato = async (req, res) => {
  try {
    const { iniciadorId, receptorId, servicoId, tipoIniciador } = req.body;

    const resultado = await criarContato({
      iniciadorId,
      receptorId,
      servicoId,
      tipoIniciador
    });

    res.status(201).json({
      mensagem: 'Contato criado com sucesso.',
      contato: resultado.contato,
      linkWhatsApp: resultado.linkWhatsApp
    });

  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

export const avaliarServico = async (req, res) => {
  try {
    const servicoId = req.params.id;
    const { nota } = req.body;

    if (nota < 1 || nota > 5) {
      return res.status(400).json({ erro: 'Nota inválida' });
    }

    const servico = await Servico.findById(servicoId).populate('motorista');
    if (!servico) {
      return res.status(404).json({ erro: 'Serviço não encontrado' });
    }

    // Salvar avaliação no serviço
    servico.avaliacao = { nota, avaliado: true };
    await servico.save();

    res.json({ mensagem: 'Avaliação salva com sucesso' });
  } catch (error) {
    console.error('Erro ao salvar avaliação:', error);
    res.status(500).json({ erro: 'Erro ao salvar avaliação' });
  }
};


const buscarContatosDoUsuario = async (usuarioId, tipoUsuario) => {
  const filtro =
    tipoUsuario === 'cliente'
      ? { cliente: usuarioId }
      : { motorista: usuarioId };

  const contatos = await Contato.find(filtro)
    .populate('servico')
    .populate('cliente', '_id nome email telefone')
    .populate('motorista', '_id nome email telefone')
    .sort({ dataContato: -1 });

  // Mapeia para destacar apenas os dados relevantes
  return contatos.map((contato) => {
    const outroUsuario =
      tipoUsuario === 'cliente' ? contato.motorista : contato.cliente;

    return {
      contatoId: contato._id,
      dataContato: contato.dataContato,
      servico: contato.servico,
      outroUsuario: {
        _id: outroUsuario?._id,
        nome: outroUsuario?.nome,
        email: outroUsuario?.email,
        telefone: outroUsuario?.telefone,
      },
    };
  });
};

export const listarContatos = async (req, res) => {
  try {
    const { id, tipo } = req.user;

    const contatos = await buscarContatosDoUsuario(id, tipo);

    res.json(contatos);
  } catch (err) {
    console.error('Erro ao listar contatos:', err);
    res.status(500).json({ erro: 'Erro ao listar contatos' });
  }
};

export default {
  iniciarContato,
  listarContatos
};
