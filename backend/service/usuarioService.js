import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import Usuario from '../models/Usuarios.js';

// Esquema de validação para cadastro
const cadastroSchema = Joi.object({
  nome: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  senha: Joi.string().min(6).required(),
  tipo: Joi.string().valid('motorista', 'cliente').required(),
  telefone: Joi.string().min(10).required(),
  endereco: Joi.object({
    cidade: Joi.string().allow('').optional(),
    estado: Joi.string().allow('').optional(),
  }).optional(),
  motoristaDetalhes: Joi.when('tipo', {
    is: 'motorista',
    then: Joi.object({
      cnh: Joi.string().required(),
      tipoVeiculo: Joi.string().valid('caminhonete', 'van', 'caminhao', 'outro').required(),
    }).required(),
    otherwise: Joi.forbidden(),
  }),
});

// Esquema de validação para login
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'E-mail deve ser válido',
    'any.required': 'E-mail é obrigatório',
  }),
  senha: Joi.string().min(6).required().messages({
    'string.min': 'Senha deve ter no mínimo 6 caracteres',
    'any.required': 'Senha é obrigatória',
  }),
});

// Cadastro de usuário
export const cadastrarUsuario = async (req, res) => {
  try {
    // Validar dados
    const { error } = cadastroSchema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ erro: error.details.map(detail => detail.message) });

    const { nome, email, senha, tipo, telefone, endereco, motoristaDetalhes } = req.body;

    // Verificar se o e-mail já existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) return res.status(400).json({ erro: 'E-mail já cadastrado' });

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Criar usuário
    const usuario = new Usuario({
      nome, email, senha: senhaHash, tipo, telefone, endereco,
      motoristaDetalhes: tipo === 'motorista' ? motoristaDetalhes : undefined,
    });

    await usuario.save();

    // Gerar token JWT
    const token = jwt.sign({ id: usuario._id, tipo: usuario.tipo }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ mensagem: 'Usuário criado', token });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao cadastrar usuário' });
  }
};

// Login de usuário
export const loginUsuario = async (req, res) => {
  try {
    // Validar dados
    const { error } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ erro: error.details.map(detail => detail.message) });

    const { email, senha } = req.body;

    // Verificar se o usuário existe
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(400).json({ erro: 'E-mail ou senha inválidos' });

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) return res.status(400).json({ erro: 'E-mail ou senha inválidos' });

    // Gerar token JWT
    const token = jwt.sign({ id: usuario._id, tipo: usuario.tipo }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ mensagem: 'Login bem-sucedido', token });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao fazer login' });
  }
};

