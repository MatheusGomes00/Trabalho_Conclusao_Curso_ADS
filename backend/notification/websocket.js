import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

const connectedUsers = new Map();
let io;

const setupWebSocket = (server) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET não configurado no ambiente.');
  }
  
    io = new Server(server, { 
    cors: {
    origin: ['http://localhost:5000', 'http://localhost:8081', 'http://192.168.100.31:5000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    },
    });
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Token ausente'));
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.id;
        socket.userTipo = decoded.tipo; // Supondo que o tipo está no token
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
        return next(new Error('Token expirado'));
        }
        return next(new Error('Token inválido'));
    }
    });
  io.on('connection', (socket) => {
    console.log(`Usuário conectado: ${socket.userId}, Total: ${connectedUsers.size}`);
    connectedUsers.set(socket.userId.toString(), { socketId: socket.id, tipo: socket.userTipo });
    socket.on('disconnect', () => {
      console.log(`Usuário desconectado: ${socket.userId}, Total: ${connectedUsers.size}`);
      connectedUsers.delete(socket.userId.toString());
    });
  });
  return io;
};

const enviarNotificacao = (userId, evento, dados) => {
  if (!userId || typeof userId !== 'string') {
    console.error(`ID usuario inválido: ${userId}`);
    return;
  }
  const userInfo = connectedUsers.get(userId.toString());
  if (userInfo && userInfo.socketId) {
    io.to(userInfo.socketId).emit(evento, dados);
  } else {
    console.log(`Usuario ${userId} não está conectado para receber notificação.`);
  }
};

const notificarTodosMotoristas = (evento, dados) => {
  for (const [userId, info] of connectedUsers.entries()) {
    if (info.tipo === 'motorista') {
      io.to(info.socketId).emit(evento, dados);
    }
  }
};

export { setupWebSocket, enviarNotificacao, notificarTodosMotoristas };