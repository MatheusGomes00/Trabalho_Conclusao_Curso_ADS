import express from 'express';
import { uploadDocs } from '../config/multer.js';
import * as service from '../service/documentosService.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.post('/enviarArqv', authMiddleware, uploadDocs.fields([
    { name: 'refDocFrente', maxCount: 1 },
    { name: 'refDocVerso', maxCount: 1 },
    { name: 'refSelfie', maxCount: 1 },
  ]),
  service.enviarDocumentos
);

router.get('/status', authMiddleware, service.verificarStatus)

export default router;
