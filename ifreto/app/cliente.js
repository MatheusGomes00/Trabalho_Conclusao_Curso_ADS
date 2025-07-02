import { Dimensions, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Cabecalho from '../components/Cabecalho';
import Rodape from '../components/Rodape';
import useSocket from '../services/useSocket';

const { width } = Dimensions.get('window');

const Cliente = () => {
  useSocket();
  
  const router = useRouter();

  const handlePostarServicos = () => {
    router.push('/postarServico');
  };

  const handleConsultarHistorico = () => {
    router.push('/historicoCliente');
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
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Cabecalho />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Card: Publicar Serviços */}
        <TouchableOpacity style={styles.card} onPress={handlePostarServicos} activeOpacity={0.8}>
          <Ionicons name="arrow-redo-outline" size={Math.round(width * 0.09)} color="#007AFF" />
          <Text style={styles.cardTitle}>Publicar Serviços</Text>
          <Text style={styles.cardSubtitle}>Publique fretes</Text>
        </TouchableOpacity>

        {/* Card: Histórico de Publicações */}
        <TouchableOpacity style={styles.card} onPress={handleConsultarHistorico} activeOpacity={0.8}>
          <Ionicons name="time" size={Math.round(width * 0.09)} color="#007AFF" />
          <Text style={styles.cardTitle}>Histórico de Serviços</Text>
          <Text style={styles.cardSubtitle}>Consulte seus fretes</Text>
        </TouchableOpacity>

        {/* Card: Chat */}
        <TouchableOpacity style={styles.card} onPress={handleContactar} activeOpacity={0.8}>
          <Ionicons name="chatbubbles" size={Math.round(width * 0.09)} color="#007AFF" />
          <Text style={styles.cardTitle}>Chat</Text>
          <Text style={styles.cardSubtitle}>Converse com motoristas</Text>
        </TouchableOpacity>
        {/* Card: Cadastro */}
        <TouchableOpacity style={styles.card} onPress={handleEditarCadastro} activeOpacity={0.8}>
          <Ionicons name="person-outline" size={Math.round(width * 0.09)} color="#007AFF" />
          <Text style={styles.cardTitle}>Cadastro</Text>
          <Text style={styles.cardSubtitle}>Edite seu cadastro</Text>
        </TouchableOpacity>
        {/* Card: Notificacoes */}
        <TouchableOpacity style={styles.card} onPress={handleVerNotificacoes} activeOpacity={0.8}>
          <Ionicons name="notifications-outline" size={Math.round(width * 0.09)} color="#007AFF" />
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
    paddingBottom: 30,
    minHeight: '100%',
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
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  cardTitle: {
    fontSize: Math.round(width * 0.045),
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
  },
  cardSubtitle: {
    fontSize: Math.round(width * 0.035),
    color: '#666',
    marginTop: 5,
  },
});

export default Cliente;