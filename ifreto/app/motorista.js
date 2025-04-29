import React from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Cabecalho from '../components/Cabecalho';
import Rodape from '../components/Rodape';

const Motorista = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Cabecalho />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Card: Consultar Serviços */}
        <TouchableOpacity style={styles.card}>
          <Ionicons name="search" size={40} color="#007AFF" />
          <Text style={styles.cardTitle}>Consultar Serviços</Text>
          <Text style={styles.cardSubtitle}>Veja fretes disponíveis</Text>
        </TouchableOpacity>

        {/* Card: Histórico de Serviços */}
        <TouchableOpacity style={styles.card}>
          <Ionicons name="time" size={40} color="#007AFF" />
          <Text style={styles.cardTitle}>Histórico de Serviços</Text>
          <Text style={styles.cardSubtitle}>Consulte seus fretes</Text>
        </TouchableOpacity>

        {/* Card: Chat */}
        <TouchableOpacity style={styles.card}>
          <Ionicons name="chatbubbles" size={40} color="#007AFF" />
          <Text style={styles.cardTitle}>Chat</Text>
          <Text style={styles.cardSubtitle}>Converse com clientes</Text>
        </TouchableOpacity>
      </ScrollView>
      
      <Rodape />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});

export default Motorista;