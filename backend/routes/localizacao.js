// tg-master/backend/routes/localizacao.js
import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { atualizarLocalizacao, obterLocalizacao } from '../service/localizacaoService.js';

const router = express.Router();

router.post('/:servicoId', authMiddleware, atualizarLocalizacao);
router.get('/:servicoId', authMiddleware, obterLocalizacao);

export default router;
