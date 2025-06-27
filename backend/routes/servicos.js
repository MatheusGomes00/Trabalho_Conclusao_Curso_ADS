import express from 'express';
import * as servico from '../service/servicoService.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/buscar/:context', authMiddleware, servico.listarServicos);
router.post('/criar', authMiddleware, servico.criarServico);
router.post('/:id/aceitar', authMiddleware, servico.aceitarServico);
router.post('/:id/rejeitar', authMiddleware, servico.rejeitarServico);
router.post('/:id/iniciar', authMiddleware, servico.iniciarServico);
router.post('/:id/concluir', authMiddleware, servico.concluirServico);
router.post('/:id/cancelar', authMiddleware, servico.cancelarServico);

export default router;