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


export default {
  iniciarContato
};
