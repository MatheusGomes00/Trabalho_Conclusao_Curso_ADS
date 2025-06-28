import express from 'express';
import * as usuario from '../service/usuarioService.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.post('/usuarios', usuario.cadastrarUsuario);
router.post('/login', usuario.loginUsuario);
router.put('/editar', authMiddleware, usuario.editarUsuario)
router.delete('/excluir/:id', authMiddleware, usuario.excluirUsuario)
router.get('/buscar/:id', authMiddleware, usuario.buscarPerfil)

export default router;