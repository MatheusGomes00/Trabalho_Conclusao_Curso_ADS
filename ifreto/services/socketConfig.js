import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';


const API_URL = 'http://192.168.100.31:5000'
let socket = null;

export const connectSocket = async () => {
  if (!API_URL) {
    console.error('Erro: API_URL não está definido.');
    return null;
  }
  try {
    const token = await AsyncStorage.getItem('token');
    if (!socket) {
      
      socket = io(API_URL, {
        auth: { token },
        transports: ['websocket'], 
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socket.on('connect', () => {
        console.log('Conectado ao socket:', socket.id);
      });

      socket.on('disconnect', () => {
        console.log('Desconectado do socket');
        socket = null; // Reseta a instância para permitir reconexão futura
      });

      socket.on('connect_error', (error) => {
        console.error('Erro na conexão do socket:', error.message);
      });
    }
    return socket;
    } catch(error) {
      console.error('Erro na conexão:', error);
    }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;