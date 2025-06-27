import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Ionicons, AntDesign, FontAwesome } from '@expo/vector-icons';
import { API_URL } from '../config';
import Cabecalho from '../components/Cabecalho';
import Rodape from '../components/Rodape';

const ListaContatos = () => {
  const [contatos, setContatos] = useState([]);
  const [selectedContato, setSelectedContato] = useState(null);
  const [loading, setLoading] = useState(false);

  const filtrarContatosPorServico = (contatos) => {
    const mapaPorServico = new Map();

    contatos.forEach((contato) => {
        const servicoId = contato.servico._id;
        const dataAtual = new Date(contato.dataContato);

        const existente = mapaPorServico.get(servicoId);

        if (!existente || new Date(existente.dataContato) < dataAtual) {
        mapaPorServico.set(servicoId, contato);
        }
    });

    return Array.from(mapaPorServico.values());
  };

  const fetchContatos = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/contato/meus-contatos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const contatosFiltrados = filtrarContatosPorServico(response.data);
      setContatos(contatosFiltrados);
    } catch (error) {
      const msg = error.response?.data?.erro || 'Erro ao buscar contatos';
      Alert.alert('Erro', msg);
      console.error('Erro ao buscar contatos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContatos();
  }, []);

  const handleSelectContato = (contato) => {
    setSelectedContato(contato);
  };

  const handleCloseDetails = () => {
    setSelectedContato(null);
  };

  const handleConversar = (telefone, nome) => {
    const numero = telefone.replace(/\D/g, '').replace(/^55/, '');
    const link = `https://wa.me/55${numero}?text=Olá ${nome}, gostaria de falar sobre o frete!`;
    Linking.openURL(link).catch(() => {
      Alert.alert('Erro', 'Não foi possível abrir o WhatsApp');
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Cabecalho />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Seus Contatos</Text>
          <View style={styles.controlsContainer}>
            <View style={styles.filterPlaceholder} />
          </View>
        </View>

        {selectedContato ? (
          <View style={styles.detailCard}>
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseDetails}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.detailTitle}>Detalhes do Contato</Text>
            <Text style={styles.detailText}>Nome: {selectedContato.outroUsuario.nome}</Text>
            <Text style={styles.detailText}>Telefone: {selectedContato.outroUsuario.telefone}</Text>
            <Text style={styles.detailText}>Origem: {selectedContato.servico.origem.endereco}, {selectedContato.servico.origem.cidade}/{selectedContato.servico.origem.estado}</Text>
            <Text style={styles.detailText}>Destino: {selectedContato.servico.destino.endereco}, {selectedContato.servico.destino.cidade}/{selectedContato.servico.destino.estado}</Text>
            <Text style={styles.detailText}>Tipo de Carga: {selectedContato.servico.tipoCarga}</Text>
            <Text style={styles.detailText}>Status: {selectedContato.servico.status}</Text>
            <Text style={styles.detailText}>Preço: {selectedContato.servico.preco ? `R$ ${selectedContato.servico.preco.toFixed(2)}` : 'A combinar'}</Text>
            <View style={styles.buttonContainer}>
            </View>
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => handleConversar(selectedContato.outroUsuario.telefone, selectedContato.outroUsuario.nome)}
              >
              <FontAwesome name="whatsapp" size={20} color="#fff" />
              <Text style={styles.buttonText}>Conversar pelo WhatsApp</Text>
            </TouchableOpacity>
          </View>
        ) : (
          contatos.length > 0 ? (
            contatos.map((contato) => (
              <TouchableOpacity
                key={contato.contatoId}
                style={styles.card}
                onPress={() => handleSelectContato(contato)}
              >
                <AntDesign name="user" size={24} color="black" />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>
                    Contato: {contato.outroUsuario.nome}
                  </Text>
                  <Text style={styles.cardSubtitle}>
                    Origem: {contato.servico.origem.endereco}, {contato.servico.origem.cidade}/{contato.servico.origem.estado}
                  </Text>
                  <Text style={styles.cardSubtitle}>
                    Destino: {contato.servico.destino.endereco}, {contato.servico.destino.cidade}/{contato.servico.destino.estado}
                  </Text>
                  <Text style={styles.cardPrice}>
                    Preço: {contato.servico.preco ? `R$ ${contato.servico.preco.toFixed(2)}` : 'Combinar'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noServicos}>Nenhum contato encontrado</Text>
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
  cardSubtitle: {
  fontSize: 14,
  color: '#555', 
  marginTop: 2,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25D366', // cor oficial do WhatsApp
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 10,
    gap: 8, 
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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
  noServicos: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default ListaContatos;