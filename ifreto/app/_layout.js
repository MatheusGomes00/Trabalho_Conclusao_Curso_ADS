import { Stack } from 'expo-router';

export default function Layout() {
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
      
    </Stack>
  );
}