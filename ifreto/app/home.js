import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { jwtDecode } from 'jwt-decode';


const Home = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          router.replace('/index');
          return;
        }

        const decoded = jwtDecode(token);
        const tipo = decoded.tipo;

        if (tipo === 'motorista') {
          router.replace('/motorista');
        } else if (tipo === 'cliente') {
          router.replace('/cliente');
        } else {
          router.replace('/index');
        }
      } catch (error) {
        console.error('Erro ao decodificar token:', error);
        router.replace('/index');
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, [router]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
});

export default Home;