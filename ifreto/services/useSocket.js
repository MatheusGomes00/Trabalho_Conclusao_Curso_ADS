import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connectSocket, disconnectSocket } from '../services/socketConfig';
import * as Notifications from 'expo-notifications';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});


function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const useSocket = () => {
  useEffect(() => {
    let socketRef;

    const iniciarSocket = async () => {
      try {
        socketRef = await connectSocket();
        if (socketRef) {
          socketRef.on('statusAtualizado', async (dados) => {
            console.log('Notificação de alteração de dados recebida');
            try {
              const notificacoesSalvas = await AsyncStorage.getItem('notificacoes');
              const notificacoes = notificacoesSalvas ? JSON.parse(notificacoesSalvas) : [];

              const novaNotificacao = {
                id: uuidv4(),
                servicoId: dados.servicoId,
                titulo: 'Atualização do frete',
                mensagem: dados.mensagem,
                data: new Date().toISOString(),
              };

              const atualizado = [novaNotificacao, ...notificacoes];
              await AsyncStorage.setItem('notificacoes', JSON.stringify(atualizado));

              await Notifications.scheduleNotificationAsync({
                content: {
                  title: 'Nova atualização de serviço',
                  body: dados.mensagem,
                },
                trigger: null,
              });
            } catch (error) {
              console.error('Erro ao salvar notificação:', error);
            }
          });

          socketRef.on('novoServico', async (dados) => {
            console.log('Notificação de novo serviço recebida');
            try {
              const notificacoesSalvas = await AsyncStorage.getItem('notificacoes');
              const notificacoes = notificacoesSalvas ? JSON.parse(notificacoesSalvas) : [];

              const novaNotificacao = {
                id: uuidv4(),
                servicoId: dados.servicoId,
                titulo: 'Novo serviço disponível',
                mensagem: dados.mensagem,
                data: new Date().toISOString(),
              };

              const atualizado = [novaNotificacao, ...notificacoes];
              await AsyncStorage.setItem('notificacoes', JSON.stringify(atualizado));

              await Notifications.scheduleNotificationAsync({
                content: {
                  title: 'Novo serviço disponível',
                  body: dados.mensagem,
                },
                trigger: null,
              });
            } catch (error) {
              console.error('Erro ao salvar notificação (novoServico):', error);
            }
          });
        } else {
          return
        }
      } catch (error) {
        console.error('Erro ao iniciar socket:', error);
      }
    };

    iniciarSocket();

    return () => {
      console.log('Desmontando componente, desconectando socket...');
      if (socketRef) {
        socketRef.off('statusAtualizado');
        socketRef.off('novoServico');
        disconnectSocket();
      }
    };
  }, []);
};

export default useSocket;