import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack screenOptions={{ headerBackTitleVisible: false }}>
      <Stack.Screen name="index" 
                    options={{ 
                        title: 'iFreto',
                        headerBackVisible: false }} />
      <Stack.Screen name="cadastro" options={{ title: 'iFreto' }} />
      <Stack.Screen name="home" 
                    options={{ 
                      title: 'Home',
                      gestureEnabled: false }} />
    </Stack>
  );
}