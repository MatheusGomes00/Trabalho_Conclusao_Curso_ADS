import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';
import { API_URL } from '../config';

const MapaMotorista = ({ servicoId }) => {
  const [localizacao, setLocalizacao] = useState(null);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

  const fetchLocalizacao = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/servicos/${servicoId}/localizacao`);
      const { latitude, longitude } = response.data;

      if (latitude && longitude) {
        setLocalizacao({
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } else {
        Alert.alert('Erro', 'Localização do motorista não disponível.');
      }
    } catch (error) {
      console.error('Erro ao buscar localização:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a localização do motorista.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Pega localização na montagem
    fetchLocalizacao();

    // Atualiza a cada 10 segundos (10000ms)
    intervalRef.current = setInterval(fetchLocalizacao, 10000);

    // Limpa o intervalo ao desmontar
    return () => clearInterval(intervalRef.current);
  }, [servicoId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#34C759" />
        <Text>Carregando localização do motorista...</Text>
      </View>
    );
  }

  if (!localizacao) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Localização não disponível</Text>
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      region={localizacao}
      showsUserLocation={false}
      showsMyLocationButton={false}
    >
      <Marker coordinate={localizacao} title="Motorista" />
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: 300,
    marginTop: 10,
    borderRadius: 10,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
  },
});

export default MapaMotorista;
