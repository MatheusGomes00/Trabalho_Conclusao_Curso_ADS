import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Alert } from 'react-native';

export function useNotificationPermission() {
  useEffect(() => {
    async function pedirPermissao() {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        const { status: novoStatus } = await Notifications.requestPermissionsAsync();
        if (novoStatus !== 'granted') {
          Alert.alert('Permissão necessária', 'Ative as notificações para receber alertas de novos serviços.');
        }
      }
    }
    pedirPermissao();
  }, []);
}