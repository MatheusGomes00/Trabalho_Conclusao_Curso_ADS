import { Stack } from 'expo-router';
import '../utils/notification/notificationConfig';
import { useNotificationPermission } from '../utils/notification/useNotification';
import { LogBox } from 'react-native';

export default function Layout() {
  useNotificationPermission();
  LogBox.ignoreLogs([
    'expo-notifications: Android Push notifications (remote notifications)',
    '`expo-notifications` functionality is not fully supported in Expo Go',
  ]);

  return (
    <Stack screenOptions={{ headerBackTitleVisible: false }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'iFreto',
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="cadastro"
        options={{
          title: 'iFreto',
        }}
      />
      <Stack.Screen
        name="home"
        options={{
          title: 'Home',
          gestureEnabled: false,
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="motorista"
        options={{
          title: 'Motorista',
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="servicosDisponiveis"
        options={{
          title: 'Serviços Disponíveis',
          headerBackVisible: true,
        }}
      />
      <Stack.Screen
        name="historicoMotora"
        options={{
          title: 'Histórico de Fretes',
          headerBackVisible: true,
        }}
      />
      <Stack.Screen
        name="cliente"
        options={{
          title: 'Cliente',
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="historicoCliente"
        options={{
          title: 'Historico de Serviços',
          headerBackVisible: true,
        }}
      />
      <Stack.Screen
        name="postarServico"
        options={{
          title: 'Publicar serviço',
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="contatos"
        options={{
          title: 'Contatos',
          headerBackVisible: true,
        }}
      />
      <Stack.Screen
        name="perfil"
        options={{
          title: 'Cadastro',
          headerBackVisible: true,
        }}
      />
      <Stack.Screen
        name="notificacoes"
        options={{
          title: 'Notificações',
          headerBackVisible: true,
        }}
      />
    </Stack>
  );
}