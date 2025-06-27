import express from 'express';
import * as servico from '../service/contatoService.js';
import authMiddleware from '../middleware/auth.js';


const router = express.Router();

router.post('/iniciarchat', authMiddleware, servico.iniciarContato);
router.get('/meus-contatos', authMiddleware, servico.listarContatos);

export default router;