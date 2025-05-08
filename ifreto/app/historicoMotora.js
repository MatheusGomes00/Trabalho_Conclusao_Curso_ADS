import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Cabecalho from '../components/Cabecalho';
import Rodape from '../components/Rodape';
import { API_URL } from '../config';


const Historico = () => {
  const [servicos, setServicos] = useState([]);
  const [selectedServico, setSelectedServico] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carregar histórico de serviços
  useEffect(() => {
    const fetchServicos = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Erro', 'Usuário não autenticado');
          return;
        }

        const response = await axios.get(`${API_URL}/api/servicos/buscar`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Filtrar apenas serviços aceitos, em andamento ou concluídos
        const filteredServicos = response.data.filter((servico) =>
          ['aceito', 'em andamento', 'concluido'].includes(servico.status)
        );
        setServicos(filteredServicos);
      } catch (error) {
        const errorMessage = error.response?.data?.erro || 'Erro ao carregar histórico';
        Alert.alert('Erro', errorMessage);
        console.error('Erro ao carregar histórico:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServicos();
  }, []);

  const handleSelectServico = (servico) => {
    setSelectedServico(servico);
  };

  const handleCloseDetails = () => {
    setSelectedServico(null);
  };

  const handleContactar = () => {
    // Placeholder para chat
    console.log('Entrar em contato:', selectedServico?._id);
    Alert.alert('Info', 'Funcionalidade de chat será implementada em breve');
  };

  const handleIniciar = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/servicos/${selectedServico._id}/iniciar`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert('Sucesso', 'Frete iniciado com sucesso');
      setServicos(servicos.map((s) =>
        s._id === selectedServico._id ? { ...s, status: 'em andamento' } : s
      ));
      setSelectedServico({ ...selectedServico, status: 'em andamento' });
    } catch (error) {
      const errorMessage = error.response?.data?.erro || 'Erro ao iniciar frete';
      Alert.alert('Erro', errorMessage);
      console.error('Erro ao iniciar frete:', error);
    }
  };

  const handleConcluir = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/servicos/${selectedServico._id}/concluir`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert('Sucesso', 'Frete concluído com sucesso');
      setServicos(servicos.map((s) =>
        s._id === selectedServico._id ? { ...s, status: 'concluido', dataConclusao: new Date() } : s
      ));
      setSelectedServico({ ...selectedServico, status: 'concluido', dataConclusao: new Date() });
    } catch (error) {
      const errorMessage = error.response?.data?.erro || 'Erro ao concluir frete';
      Alert.alert('Erro', errorMessage);
      console.error('Erro ao concluir frete:', error);
    }
  };

  const handleRejeitar = async () => {
    Alert.alert(
      'Confirmar Rejeição',
      'Deseja realmente desistir deste serviço?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
            text: 'Rejeitar',
            style: 'destructive',
            onPress: async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const response = await axios.post(
                `${API_URL}/api/servicos/${selectedServico._id}/rejeitar`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
                );

                Alert.alert('Sucesso', 'Serviço rejeitado com sucesso');
                setServicos(servicos.filter((s) => s._id !== selectedServico._id));
                setSelectedServico(null);
            } catch (error) {
                const errorMessage = error.response?.data?.erro || 'Erro ao rejeitar serviço';
                Alert.alert('Erro', errorMessage);
                console.error('Erro ao rejeitar serviço:', error);
            }
            },
        },
      ]
    );
  };  

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Cabecalho />
        <View style={styles.loadingContainer}>
          <Text>Carregando histórico...</Text>
        </View>
        <Rodape />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Cabecalho />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Histórico de Fretes</Text>
        {selectedServico ? (
          <View style={styles.detailCard}>
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseDetails}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.detailTitle}>Detalhes do Frete</Text>
            <Text style={styles.detailText}>
              Cliente: {selectedServico.cliente?.nome || 'Não disponível'}
            </Text>
            <Text style={styles.detailText}>
              Origem: {selectedServico.origem.cidade}, {selectedServico.origem.estado}
            </Text>
            <Text style={styles.detailText}>
              Destino: {selectedServico.destino.cidade}, {selectedServico.destino.estado}
            </Text>
            <Text style={styles.detailText}>Tipo de Carga: {selectedServico.tipoCarga}</Text>
            <Text style={styles.detailText}>Peso Estimado: {selectedServico.pesoEstimado} kg</Text>
            <Text style={styles.detailText}>Preço: R$ {selectedServico.preco.toFixed(2)}</Text>
            <Text style={styles.detailText}>Status: {selectedServico.status}</Text>
            <Text style={styles.detailText}>
              Data de Criação: {new Date(selectedServico.dataCriacao).toLocaleDateString()}
            </Text>
            <Text style={styles.detailText}>
              Data de Agendamento: {selectedServico.dataAgendamento
                ? new Date(selectedServico.dataAgendamento).toLocaleDateString()
                : 'Não definida'}
            </Text>
            <Text style={styles.detailText}>
              Data de Conclusão: {selectedServico.dataConclusao
                ? new Date(selectedServico.dataConclusao).toLocaleDateString()
                : 'Não concluído'}
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.contactButton} onPress={handleContactar}>
                <Text style={styles.buttonText}>Entrar em Contato</Text>
              </TouchableOpacity>
              {selectedServico.status === 'aceito' && (
                <>
                  <TouchableOpacity style={styles.startButton} onPress={handleIniciar}>
                    <Text style={styles.buttonText}>Iniciar Frete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.rejectButton} onPress={handleRejeitar}>
                    <Text style={styles.buttonText}>Rejeitar</Text>
                  </TouchableOpacity>
                </>
              )}
              {selectedServico.status === 'em andamento' && (
                <TouchableOpacity style={styles.completeButton} onPress={handleConcluir}>
                  <Text style={styles.buttonText}>Concluir Frete</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ) : (
          servicos.length > 0 ? (
            servicos.map((servico) => (
              <TouchableOpacity
                key={servico._id}
                style={styles.card}
                onPress={() => handleSelectServico(servico)}
              >
                <AntDesign name="enviromento" size={24} color="black" />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>
                    Origem: {servico.origem.cidade}, {servico.origem.estado}
                  </Text>
                  <Text style={styles.cardTitle}>
                    Destino: {servico.destino.cidade}, {servico.destino.estado}
                  </Text>
                  <Text style={styles.cardPrice}>R$ {servico.preco.toFixed(2)}</Text>
                  <Text style={styles.cardStatus}>Status: {servico.status}</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noServicos}>Nenhum frete encontrado no histórico</Text>
          )
        )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
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
  cardContent: {
    flex: 1,
    marginLeft: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  cardStatus: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  detailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    flexWrap: 'wrap',
  },
  contactButton: {
    backgroundColor: '#007AFF',
    borderRadius: 5,
    padding: 10,
    flex: 1,
    marginRight: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#34C759',
    borderRadius: 5,
    padding: 10,
    flex: 1,
    marginRight: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  completeButton: {
    backgroundColor: '#34C759',
    borderRadius: 5,
    padding: 10,
    flex: 1,
    marginBottom: 10,
    alignItems: 'center',
  },
  rejectButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 5,
    padding: 10,
    flex: 1,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  noServicos: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default Historico;