import { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import Cabecalho from '../components/Cabecalho';
import Rodape from '../components/Rodape';
import { API_URL } from '../config';


const ServicosDisponiveis = () => {
  const [servicos, setServicos] = useState([]);
  const [selectedServico, setSelectedServico] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Função para carregar serviços disponíveis
  const fetchServicos = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Erro', 'Usuário não autenticado');
        return;
      }

      const context = "disponiveis"

      const response = await axios.get(`${API_URL}/api/servicos/buscar/${context}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Filtrar apenas serviços com status 'aberto'
      const servicosAbertos = response.data.filter((servico) => servico.status === 'aberto');
      setServicos(servicosAbertos);
    } catch (error) {
      const errorMessage = error.response?.data?.erro || 'Erro ao carregar serviços';
      Alert.alert('Erro', errorMessage);
      console.error('Erro ao carregar serviços:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar serviços na inicialização
  useEffect(() => {
    fetchServicos();
  }, []);

  // Função para atualizar a página
  const handleAtualizar = () => {
    fetchServicos();
  };

  const handleSelectServico = (servico) => {
    setSelectedServico(servico);
  };

  const handleCloseDetails = () => {
    setSelectedServico(null);
  };

  const handleAceitar = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(
        `${API_URL}/api/servicos/${selectedServico._id}/aceitar`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert('Sucesso', 'Serviço aceito com sucesso', [
        {
          text: 'OK',
          onPress: () => router.push('/historicoMotora'),
        },
      ]);
      setServicos(servicos.filter((s) => s._id !== selectedServico._id));
      setSelectedServico(null);
    } catch (error) {
      const errorMessage = error.response?.data?.erro || 'Erro ao aceitar serviço';
      Alert.alert('Erro', errorMessage);
      console.error('Erro ao aceitar serviço:', error);
    }
  };

  const handleRecusar = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(
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
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Cabecalho />
        <View style={styles.loadingContainer}>
          <Text>Carregando serviços...</Text>
        </View>
        <Rodape />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Cabecalho />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Serviços Disponíveis</Text>
          <View style={styles.controlsContainer}>
            <View style={styles.filterPlaceholder} />
            <TouchableOpacity style={styles.refreshButton} onPress={handleAtualizar}>
                <Ionicons name="refresh" size={20} color="#FFFFFF" />
                <Text style={styles.refreshButtonText}>Atualizar</Text>
            </TouchableOpacity>
            </View>
        </View>
        {selectedServico ? (
          <View style={styles.detailCard}>
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseDetails}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.detailTitle}>Detalhes do Serviço</Text>
            <Text style={styles.detailText}>
              Origem: {selectedServico.origem.endereco}, {selectedServico.origem.cidade}, {selectedServico.origem.estado}
            </Text>
            <Text style={styles.detailText}>
              Destino: {selectedServico.destino.endereco}, {selectedServico.destino.cidade}, {selectedServico.destino.estado}
            </Text>
            <Text style={styles.detailText}>Tipo de Carga: {selectedServico.tipoCarga}</Text>
            <Text style={styles.detailText}>
              Peso Estimado: {selectedServico.pesoEstimado ? `${selectedServico.pesoEstimado} kg` : 'Não definido'}
            </Text>
            <Text style={styles.detailText}>
              Preço: {selectedServico.preco ? `R$ ${selectedServico.preco.toFixed(2)}` : 'Combinar'}
            </Text>
            <Text style={styles.detailText}>Status: {selectedServico.status}</Text>
            <Text style={styles.detailText}>
              Data de Criação: {new Date(selectedServico.dataCriacao).toLocaleDateString()}
            </Text>
            <Text style={styles.detailText}>
              Data de Agendamento:{' '}
              {selectedServico.dataAgendamento
                ? new Date(selectedServico.dataAgendamento).toLocaleDateString()
                : 'Não definida'}
            </Text>
            <View style={styles.buttonContainer}>
              {selectedServico.status === 'aberto' && (
                <>
                  <TouchableOpacity style={styles.acceptButton} onPress={handleAceitar}>
                    <Text style={styles.buttonText}>Aceitar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.rejectButton} onPress={handleRecusar}>
                    <Text style={styles.buttonText}>Recusar</Text>
                  </TouchableOpacity>
                </>
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
                    Origem: {servico.origem.endereco}, {servico.origem.cidade}, {servico.origem.estado}
                  </Text>
                  <Text style={styles.cardTitle}>
                    Destino: {servico.destino.endereco}, {servico.destino.cidade}, {servico.destino.estado}
                  </Text>
                  <Text style={styles.cardPrice}>
                    Preço: {servico.preco ? `R$ ${servico.preco.toFixed(2)}` : 'Combinar'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noServicos}>Nenhum serviço disponível</Text>
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
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  filterPlaceholder: {
    flex: 1,
    marginRight: 10,
  },
  refreshButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 5,
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
    color: '#333',
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
  },
  contactButton: {
    backgroundColor: '#007AFF',
    borderRadius: 5,
    padding: 10,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#34C759',
    borderRadius: 5,
    padding: 10,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  rejectButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 5,
    padding: 10,
    flex: 1,
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

export default ServicosDisponiveis;