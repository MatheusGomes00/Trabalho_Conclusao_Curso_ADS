import express from 'express';
import * as servicoController from '../controllers/servicoController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/buscar', authMiddleware, servicoController.listarServicos);
router.post('/criar', authMiddleware, servicoController.criarServico);
router.post('/:id/aceitar', authMiddleware, servicoController.aceitarServico);
router.post('/:id/rejeitar', authMiddleware, servicoController.rejeitarServico);
router.post('/:id/iniciar', authMiddleware, servicoController.iniciarServico);
router.post('/:id/concluir', authMiddleware, servicoController.concluirServico);
router.post('/:id/cancelar', authMiddleware, servicoController.cancelarServico);

export default router;