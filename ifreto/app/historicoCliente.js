import { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Linking from 'expo-linking';
import { Picker } from '@react-native-picker/picker';
import Cabecalho from '../components/Cabecalho';
import Rodape from '../components/Rodape';
import { API_URL } from '../config';
import { useRouter } from 'expo-router';
import Modal from 'react-native-modal';
import { Rating } from 'react-native-ratings';

const HistoricoCliente = () => {
  const [servicos, setServicos] = useState([]);
  const [selectedServico, setSelectedServico] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [mostrarModalAvaliacao, setMostrarModalAvaliacao] = useState(false);
  const [notaAvaliacao, setNotaAvaliacao] = useState(5);
  const router = useRouter();

  useEffect(() => {
    const fetchServicos = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return Alert.alert('Erro', 'Usuário não autenticado');

        const response = await axios.get(`${API_URL}/api/servicos/buscar/historico`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setServicos(response.data);
      } catch (error) {
        Alert.alert('Erro', error.response?.data?.erro || 'Erro ao carregar histórico');
      } finally {
        setLoading(false);
      }
    };

    fetchServicos();
  }, []);

  const handleSelectServico = (servico) => {
    setSelectedServico(servico);
    // O modal será controlado por efeito colateral abaixo
  };

  useEffect(() => {
    // Sempre que selectedServico mudar, verifica se precisa abrir o modal
    if (
      selectedServico &&
      selectedServico.status === 'concluido' &&
      !selectedServico.avaliacao?.avaliado
    ) {
      setNotaAvaliacao(5); // valor padrão
      setMostrarModalAvaliacao(true);
    } else {
      setMostrarModalAvaliacao(false);
    }
  }, [selectedServico]);

  const handleCloseDetails = () => {
    setSelectedServico(null);
    setMostrarModalAvaliacao(false);
  }
  

  const handleContatar = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!selectedServico) return Alert.alert('Erro', 'Nenhum serviço selecionado.');

      const iniciadorId = selectedServico.cliente?._id;
      const receptorId = selectedServico.motorista?._id;
      if (!iniciadorId || !receptorId) return Alert.alert('Erro', 'Dados do cliente ou motorista não disponíveis.');

      const response = await axios.post(`${API_URL}/api/contato/iniciarchat`, {
        iniciadorId, receptorId, servicoId: selectedServico._id, tipoIniciador: 'cliente'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const { linkWhatsApp } = response.data.linkWhatsApp;
      if (linkWhatsApp) Linking.openURL(linkWhatsApp);
      else Alert.alert('Erro', 'Link do WhatsApp não recebido.');
    } catch (error) {
      Alert.alert('Erro', error.response?.data?.erro || 'Erro ao iniciar contato');
    }
  };

  const handleCancelarPub = async () => {
    if (!selectedServico) return;
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(`${API_URL}/api/servicos/${selectedServico._id}/cancelar`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setServicos(prev =>
        prev.map(s => s._id === selectedServico._id ? { ...s, status: 'cancelado' } : s)
      );
      setSelectedServico({ ...selectedServico, status: 'cancelado' });
      Alert.alert('Sucesso', 'Serviço cancelado com sucesso');
    } catch (error) {
      const msg = error.response?.status === 400
        ? 'Não é possível cancelar: serviço não está aberto ou aceito'
        : error.response?.data?.erro || 'Erro ao cancelar serviço';
      Alert.alert('Erro', msg);
    }
  };

  const enviarAvaliacao = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(`${API_URL}/api/servicos/${selectedServico._id}/avaliar`, {
        nota: notaAvaliacao
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSelectedServico({
        ...selectedServico,
        avaliacao: { nota: notaAvaliacao, avaliado: true }
      });

      setServicos(prev =>
        prev.map(s => s._id === selectedServico._id
          ? { ...s, avaliacao: { nota: notaAvaliacao, avaliado: true } }
          : s)
      );

      Alert.alert("Obrigado!", "Sua avaliação foi registrada com sucesso.");
      setMostrarModalAvaliacao(false);
    } catch (error) {
      Alert.alert("Erro", "Erro ao enviar a avaliação.");
    }
  };

  const filtrarServicos = () => filtroStatus === 'todos' ? servicos : servicos.filter(s => s.status === filtroStatus);

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
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={filtroStatus}
            onValueChange={setFiltroStatus}
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

        {selectedServico ? (
          <View style={styles.detailCard}>
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseDetails}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>

            <Text style={styles.detailTitle}>Detalhes do Frete</Text>
            <Text style={styles.detailText}>Cliente: {selectedServico.cliente?.nome || 'Não disponível'}</Text>
            <Text style={styles.detailText}>Origem: {selectedServico.origem.endereco}, {selectedServico.origem.cidade}, {selectedServico.origem.estado}</Text>
            <Text style={styles.detailText}>Destino: {selectedServico.destino.endereco}, {selectedServico.destino.cidade}, {selectedServico.destino.estado}</Text>
            <Text style={styles.detailText}>Tipo de Carga: {selectedServico.tipoCarga}</Text>
            <Text style={styles.detailText}>Peso Estimado: {selectedServico.pesoEstimado ? `${selectedServico.pesoEstimado} kg` : 'Não definido'}</Text>
            <Text style={styles.detailText}>Preço: {selectedServico.preco ? `R$ ${selectedServico.preco.toFixed(2)}` : 'Combinar'}</Text>
            <Text style={styles.detailText}>Status: {selectedServico.status}</Text>
            <Text style={styles.detailText}>Data de Criação: {new Date(selectedServico.dataCriacao).toLocaleDateString()}</Text>
            <Text style={styles.detailText}>Data de Agendamento: {selectedServico.dataAgendamento ? new Date(selectedServico.dataAgendamento).toLocaleDateString() : 'Não definido'}</Text>
            <Text style={styles.detailText}>Data de Conclusão: {selectedServico.dataConclusao ? new Date(selectedServico.dataConclusao).toLocaleDateString() : 'Não concluído'}</Text>

            {selectedServico.status === 'concluido' && selectedServico.avaliacao?.avaliado && (
              <View style={styles.avaliacaoContainer}>
                <Text style={styles.avaliacaoTexto}>
                  Avaliação do Motorista: {selectedServico.avaliacao.nota.toFixed(1)} / 5
                </Text>
              </View>
            )}

            <View style={styles.buttonContainer}>
              {(selectedServico.status === 'aberto' || selectedServico.status === 'aceito') && (
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancelarPub}>
                  <Text style={styles.buttonText}>Cancelar Serviço</Text>
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity style={styles.contactButton} onPress={handleContatar}>
              <FontAwesome name="whatsapp" size={20} color="#fff" />
              <Text style={styles.buttonText}>Conversar pelo WhatsApp</Text>
            </TouchableOpacity>

            {selectedServico.status === 'em andamento' && (
              Platform.OS === 'web' ? (
                <View style={[styles.startButton, { backgroundColor: '#ccc' }]}>
                  <Text style={styles.buttonText}>Acompanhamento de envio não disponível no navegador</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.startButton}
                  onPress={() => router.push(`/acompanharEnvio?servicoId=${selectedServico._id}`)}
                >
                  <Text style={styles.buttonText}>Acompanhar Envio</Text>
                </TouchableOpacity>
              )
            )}
          </View>
        ) : (
          filtrarServicos().length > 0 ? (
            filtrarServicos().map(servico => (
              <TouchableOpacity
                key={servico._id}
                style={styles.card}
                onPress={() => handleSelectServico(servico)}
              >
                <AntDesign name="enviromento" size={24} color="black" />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>Origem: {servico.origem.endereco}, {servico.origem.cidade}</Text>
                  <Text style={styles.cardTitle}>Destino: {servico.destino.endereco}, {servico.destino.cidade}</Text>
                  <Text style={styles.cardPrice}>Valor: {servico.preco ? `R$ ${servico.preco.toFixed(2)}` : 'Combinar'}</Text>
                  <Text style={styles.cardStatus}>Status: {servico.status}</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noServicos}>Nenhum frete encontrado</Text>
          )
        )}

        <Modal isVisible={mostrarModalAvaliacao}>
          <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 12, alignItems: 'center', minWidth: 300, minHeight: 220 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Avalie o motorista</Text>
            <Rating
              type="star"
              ratingCount={5}
              imageSize={32}
              startingValue={notaAvaliacao}
              onFinishRating={setNotaAvaliacao}
              showRating
              reviews={['Ruim', 'Razoável', 'Bom', 'Muito Bom', 'Excelente']}
              style={{ minHeight: 100, marginBottom: 10 }}
            />
            <TouchableOpacity
              style={{
                backgroundColor: '#34C759',
                padding: 12,
                borderRadius: 8,
                width: '100%',
                alignItems: 'center'
              }}
              onPress={enviarAvaliacao}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Enviar Avaliação</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </ScrollView>
      <Rodape />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 20 },
  pickerContainer: { backgroundColor: '#fff', borderRadius: 5, marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  picker: { height: 50, color: '#333' },
  card: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 10, padding: 20, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, alignItems: 'center' },
  cardContent: { flex: 1, marginLeft: 15 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 5 },
  cardPrice: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cardStatus: { fontSize: 14, color: '#666', fontWeight: 'bold' },
  detailCard: { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 20, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  detailTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 15, textAlign: 'center' },
  detailText: { fontSize: 16, color: '#333', marginBottom: 10 },
  closeButton: { alignSelf: 'flex-end', padding: 5 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, gap: 10, flexWrap: 'wrap' },
  contactButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#25D366', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 12, marginTop: 10, gap: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cancelButton: { backgroundColor: '#FF3B30', padding: 10, borderRadius: 5, flex: 1, marginRight: 10, marginBottom: 10, alignItems: 'center', minWidth: 120, opacity: 1 },
  startButton: { backgroundColor: '#34C759', borderRadius: 5, padding: 10, flex: 1, marginRight: 10, marginBottom: 10, alignItems: 'center' },
  completeButton: { backgroundColor: '#34C759', borderRadius: 5, padding: 10, flex: 1, marginBottom: 10, alignItems: 'center' },
  rejectButton: { backgroundColor: '#FF3B30', borderRadius: 5, padding: 10, flex: 1, marginBottom: 10, alignItems: 'center' },
  noServicos: { fontSize: 16, color: '#666', textAlign: 'center' },
  avaliacaoContainer: { backgroundColor: '#fff8e1', padding: 12, borderRadius: 8, marginTop: 20, alignItems: 'center', borderWidth: 1, borderColor: '#ffe082' },
  avaliacaoTexto: { fontSize: 18, fontWeight: 'bold', color: '#f1c40f' },
});

export default HistoricoCliente;
