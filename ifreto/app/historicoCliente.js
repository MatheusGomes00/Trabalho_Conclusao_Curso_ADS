import { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Linking from 'expo-linking'
import { Picker } from '@react-native-picker/picker';
import Cabecalho from '../components/Cabecalho';
import Rodape from '../components/Rodape';
import { API_URL } from '../config';


const HistoricoCliente = () => {
  const [servicos, setServicos] = useState([]);
  const [selectedServico, setSelectedServico] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState('todos');

  // Carregar histórico de serviços
  useEffect(() => {
    const fetchServicos = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Erro', 'Usuário não autenticado');
          return;
        }

        const context = "historico"

        const response = await axios.get(`${API_URL}/api/servicos/buscar/${context}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setServicos(response.data);
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

  const handleContactar = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!selectedServico) {
        Alert.alert('Erro', 'Nenhum serviço selecionado.');
        return;
      }

      if (!selectedServico.cliente?._id || !selectedServico.motorista?._id) {
        Alert.alert('Erro', 'Dados do cliente ou motorista não disponíveis.');
        return;
      }

      const iniciadorId = selectedServico.cliente._id;
      const receptorId = selectedServico.motorista._id;
      const tipoIniciador = 'cliente';

      const response = await axios.post(
        `${API_URL}/api/contato/iniciarchat`,
        {
          iniciadorId,
          receptorId,
          servicoId: selectedServico._id,
          tipoIniciador
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { linkWhatsApp } = response.data;

      if (linkWhatsApp) {
        Linking.openURL(linkWhatsApp);
      } else {
        Alert.alert('Erro', 'Link do WhatsApp não recebido.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.erro || 'Erro ao iniciar contato';
      Alert.alert('Erro', errorMessage);
      console.error('Erro ao iniciar contato:', error);
    }
  };

  const handleCancelarPub = async () => {
    if (!selectedServico) return;

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Erro', 'Usuário não autenticado');
        return;
      }

      await axios.post(`${API_URL}/api/servicos/${selectedServico._id}/cancelar`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Atualizar lista localmente
      setServicos((prev) =>
        prev.map((s) =>
          s._id === selectedServico._id ? { ...s, status: 'cancelado' } : s
        )
      );
      setSelectedServico({ ...selectedServico, status: 'cancelado' });

      Alert.alert('Sucesso', 'Serviço cancelado com sucesso');
    } catch (error) {
      const errorMessage =
        error.response?.status === 400
          ? 'Não é possível cancelar: serviço não está aberto ou aceito'
          : error.response?.data?.erro || 'Erro ao cancelar serviço';
      Alert.alert('Erro', errorMessage);
      console.error('Erro ao cancelar serviço:', error);
    }
  };

  const filtrarServicos = () => {
    if (filtroStatus === 'todos') return servicos;
    return servicos.filter((servico) => servico.status === filtroStatus);
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
        <View style={styles.headerContainer}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={filtroStatus}
              onValueChange={(value) => setFiltroStatus(value)}
              style={styles.picker}
            >
              <Picker.Item label="Todos" value="todos" />
              <Picker.Item label="Aberto" value="aberto" />
              <Picker.Item label="Aceito" value="aceito" />
              <Picker.Item label="Em Andamento" value="em andamento" />
              <Picker.Item label="Concluído" value="concluido" />
              <Picker.Item label="Cancelado" value="cancelado" />
            </Picker>
          </View>
        </View>
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
              Data de Agendamento: {selectedServico.dataAgendamento
                ? new Date(selectedServico.dataAgendamento).toLocaleDateString()
                : 'Não definido'}
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
              {(selectedServico.status === 'aberto' || selectedServico.status === 'aceito') && (
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancelarPub}>
                  <Text style={styles.buttonText}>Cancelar Serviço</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ) : (
          filtrarServicos().length > 0 ? (
            filtrarServicos().map((servico) => (
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
                    Valor: {servico.preco ? `R$ ${servico.preco.toFixed(2)}` : 'Combinar'}
                  </Text>
                  <Text style={styles.cardStatus}>Status: {servico.status}</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noServicos}>Nenhum frete encontrado</Text>
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
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  picker: {
    height: 50,
    color: '#333',
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
  cardStatus: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
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
    gap: 10,
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
    minWidth: 120,
  },
  cancelButton: {
    backgroundColor: '#FF3B30', // Fundo vermelho visível
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    marginBottom: 10,
    alignItems: 'center',
    minWidth: 120,
    opacity: 1,
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

export default HistoricoCliente;