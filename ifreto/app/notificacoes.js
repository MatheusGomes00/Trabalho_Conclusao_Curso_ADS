import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificacoesScreen = () => {
  const [notificacoes, setNotificacoes] = useState([]);

  useEffect(() => {
    const carregarNotificacoes = async () => {
      try {
        const notificacoesSalvas = await AsyncStorage.getItem('notificacoes');
        if (notificacoesSalvas) {
          const notificacoesArray = JSON.parse(notificacoesSalvas);
          notificacoesArray.sort((a, b) => new Date(b.data) - new Date(a.data));
          setNotificacoes(notificacoesArray);
        }
      } catch (error) {
        console.error('Erro ao carregar notificações:', error);
      }
    };
    carregarNotificacoes();
  }, []);

  const renderNotificacao = ({ item }) => (
    <View style={styles.notificacaoContainer}>
      <Text style={styles.titulo}>{item.titulo}</Text>
      <Text style={styles.mensagem}>{item.mensagem}</Text>
      <Text style={styles.data}>{new Date(item.data).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notificacoes}
        keyExtractor={(item, index) => (item.id ? String(item.id) : String(index))}
        renderItem={renderNotificacao}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhuma notificação encontrada.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  notificacaoContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  mensagem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  data: {
    fontSize: 12,
    color: '#666',
  },
  vazio: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default NotificacoesScreen;