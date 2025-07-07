import { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import * as Linking from 'expo-linking';
import Cabecalho from '../components/Cabecalho';
import Rodape from '../components/Rodape';
import { API_URL } from '../config';
import * as Location from 'expo-location';

const Historico = () => {
  const [servicos, setServicos] = useState([]);
  const [selectedServico, setSelectedServico] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState('todos');

  useEffect(() => {
    const fetchServicos = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Erro', 'Usuário não autenticado');
          return;
        }

        const context = "historico";
        const response = await axios.get(`${API_URL}/api/servicos/buscar/${context}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const filteredServicos = response.data.filter((servico) =>
          ['aceito', 'em andamento', 'concluido'].includes(servico.status)
        );
        setServicos(filteredServicos);
      } catch (error) {
        const errorMessage = error.response?.data?.erro || 'Erro ao carregar histórico';
        Alert.alert('Erro', errorMessage);
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

  const handleContatar = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!selectedServico) return;

      const iniciadorId = selectedServico.motorista._id;
      const receptorId = selectedServico.cliente._id;
      const tipoIniciador = 'motorista';

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
      if (linkWhatsApp) Linking.openURL(linkWhatsApp);
      else Alert.alert('Erro', 'Link do WhatsApp não recebido.');
    } catch (error) {
      const msg = error.response?.data?.erro || 'Erro ao iniciar contato';
      Alert.alert('Erro', msg);
    }
  };

  const handleIniciar = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(`${API_URL}/api/servicos/${selectedServico._id}/iniciar`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'É necessário permitir acesso à localização.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      await axios.post(
        `${API_URL}/api/localizacao/${selectedServico._id}`,
        { latitude, longitude },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert('Sucesso', 'Frete iniciado com sucesso');
      setServicos(servicos.map((s) =>
        s._id === selectedServico._id ? { ...s, status: 'em andamento' } : s
      ));
      setSelectedServico({ ...selectedServico, status: 'em andamento' });
    } catch (error) {
      const msg = error.response?.data?.erro || 'Erro ao iniciar frete';
      Alert.alert('Erro', msg);
    }
  };

  const handleConcluir = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(`${API_URL}/api/servicos/${selectedServico._id}/concluir`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert('Sucesso', 'Frete concluído com sucesso');
      setServicos(servicos.map((s) =>
        s._id === selectedServico._id ? { ...s, status: 'concluido' } : s
      ));
      setSelectedServico({ ...selectedServico, status: 'concluido' });
    } catch (error) {
      const msg = error.response?.data?.erro || 'Erro ao concluir frete';
      Alert.alert('Erro', msg);
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
              await axios.post(`${API_URL}/api/servicos/${selectedServico._id}/rejeitar`, {}, {
                headers: { Authorization: `Bearer ${token}` },
              });

              Alert.alert('Sucesso', 'Serviço rejeitado');
              setServicos(servicos.filter((s) => s._id !== selectedServico._id));
              setSelectedServico(null);
            } catch (error) {
              const msg = error.response?.data?.erro || 'Erro ao rejeitar serviço';
              Alert.alert('Erro', msg);
            }
          },
        },
      ]
    );
  };

  const filtrarServicos = () => {
    if (filtroStatus === 'todos') return servicos;
    return servicos.filter((s) => s.status === filtroStatus);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Cabecalho />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={filtroStatus}
            onValueChange={setFiltroStatus}
            style={styles.picker}
          >
            <Picker.Item label="Todos" value="todos" />
            <Picker.Item label="Aceito" value="aceito" />
            <Picker.Item label="Em Andamento" value="em andamento" />
            <Picker.Item label="Concluído" value="concluido" />
          </Picker>
        </View>

        {selectedServico ? (
          <View style={styles.detailCard}>
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseDetails}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.detailTitle}>Detalhes do Frete</Text>
            <Text style={styles.detailText}>Cliente: {selectedServico?.cliente?.nome}</Text>
            <Text style={styles.detailText}>Origem: {selectedServico?.origem?.endereco}</Text>
            <Text style={styles.detailText}>Destino: {selectedServico?.destino?.endereco}</Text>
            <Text style={styles.detailText}>Tipo: {selectedServico?.tipoCarga}</Text>
            <Text style={styles.detailText}>Peso: {selectedServico?.pesoEstimado || 'N/A'} kg</Text>
            <Text style={styles.detailText}>Status: {selectedServico?.status}</Text>

            {selectedServico?.status === 'aceito' && (
              <>
                <TouchableOpacity style={styles.startButton} onPress={handleIniciar}>
                  <Text style={styles.buttonText}>Iniciar Frete</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rejectButton} onPress={handleRejeitar}>
                  <Text style={styles.buttonText}>Rejeitar</Text>
                </TouchableOpacity>
              </>
            )}
            {selectedServico?.status === 'em andamento' && (
              <TouchableOpacity style={styles.completeButton} onPress={handleConcluir}>
                <Text style={styles.buttonText}>Concluir Frete</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.contactButton} onPress={handleContatar}>
              <FontAwesome name="whatsapp" size={20} color="#fff" />
              <Text style={styles.buttonText}>WhatsApp</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filtrarServicos().map((servico) => (
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
                <Text style={styles.cardPrice}>
                  Valor: {servico.preco ? `R$ ${servico.preco.toFixed(2)}` : 'Combinar'}
                </Text>
                <Text style={styles.cardStatus}>Status: {servico.status}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
      <Rodape />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  scrollContent: { padding: 20 },
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
  picker: { height: 50, color: '#333' },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
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
  cardContent: { flex: 1, marginLeft: 15 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 5 },
  cardPrice: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cardStatus: { fontSize: 16, color: '#666', fontWeight: 'bold' },
  detailOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.98)',
    zIndex: 999, padding: 20
  },
  detailCard: { backgroundColor: '#fff', borderRadius: 10, padding: 20 },
  detailTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  detailText: { fontSize: 16, marginBottom: 10 },
  closeButton: { alignSelf: 'flex-end', padding: 5 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, flexWrap: 'wrap' },
  contactButton: { flexDirection: 'row', justifyContent: 'center', backgroundColor: '#25D366', padding: 10, borderRadius: 10, marginTop: 20, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  startButton: { backgroundColor: '#34C759', borderRadius: 5, padding: 10, flex: 1, marginRight: 10, marginBottom: 10, alignItems: 'center' },
  completeButton: { backgroundColor: '#34C759', borderRadius: 5, padding: 10, flex: 1, marginBottom: 10, alignItems: 'center' },
  rejectButton: { backgroundColor: '#FF3B30', borderRadius: 5, padding: 10, flex: 1, marginBottom: 10, alignItems: 'center' },
  noServicos: { fontSize: 16, color: '#666', textAlign: 'center' },
});

export default Historico;