import { SafeAreaView, ScrollView, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Cabecalho from '../components/Cabecalho';
import Rodape from '../components/Rodape';
import useSocket from '../services/useSocket';

const Motorista = () => {
  useSocket();
  const router = useRouter();

  const handleConsultarServicos = () => {
    router.push('/servicosDisponiveis');
  };

  const handleConsultarHistorico = () => {
    router.push('/historicoMotora');
  }

  const handleContactar = () => {
      router.push('/contatos');
  };
  
  const handleEditarCadastro = () => {
    router.push('/perfil');
  };

  const handleVerNotificacoes = () => {
    router.push('/notificacoes');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Cabecalho />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Card: Consultar Serviços */}
        <TouchableOpacity style={styles.card} onPress={handleConsultarServicos}>
          <Ionicons name="search" size={40} color="#007AFF" />
          <Text style={styles.cardTitle}>Consultar Serviços</Text>
          <Text style={styles.cardSubtitle}>Veja fretes disponíveis</Text>
        </TouchableOpacity>

        {/* Card: Histórico de Serviços */}
        <TouchableOpacity style={styles.card} onPress={handleConsultarHistorico}>
          <Ionicons name="time" size={40} color="#007AFF" />
          <Text style={styles.cardTitle}>Histórico de Serviços</Text>
          <Text style={styles.cardSubtitle}>Consulte seus fretes</Text>
        </TouchableOpacity>

        {/* Card: Chat */}
        <TouchableOpacity style={styles.card} onPress={handleContactar}>
          <Ionicons name="chatbubbles" size={40} color="#007AFF" />
          <Text style={styles.cardTitle}>Chat</Text>
          <Text style={styles.cardSubtitle}>Converse com clientes</Text>
        </TouchableOpacity>
        {/* Card: Cadastro */}
        <TouchableOpacity style={styles.card} onPress={handleEditarCadastro}>
          <Ionicons name="person-outline" size={40} color="#007AFF" />
          <Text style={styles.cardTitle}>Cadastro</Text>
          <Text style={styles.cardSubtitle}>Edite seu cadastro</Text>
        </TouchableOpacity>
        {/* Card: Notificacoes */}
        <TouchableOpacity style={styles.card} onPress={handleVerNotificacoes}>
          <Ionicons name="notifications-outline" size={40} color="#007AFF" />
          <Text style={styles.cardTitle}>Notificações</Text>
          <Text style={styles.cardSubtitle}>Ver atualizações de serviços</Text>
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