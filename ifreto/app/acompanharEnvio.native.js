import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../config';
import { useLocalSearchParams } from 'expo-router';

export default function AcompanharEnvio() {
  const { servicoId } = useLocalSearchParams();
  const [location, setLocation] = useState(null);

  useEffect(() => {
    let interval;
    const fetchLocation = async () => {
      const token = await AsyncStorage.getItem('token');
      try {
        const response = await axios.get(`${API_URL}/api/localizacao/${servicoId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLocation(response.data);
      } catch (error) {
        console.error('Erro ao buscar localização:', error);
      }
    };
    fetchLocation();
    interval = setInterval(fetchLocation, 5000);
    return () => clearInterval(interval);
  }, [servicoId]);

  if (!location) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Carregando localização...</Text>
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
    >
      <Marker
        coordinate={{ latitude: location.latitude, longitude: location.longitude }}
        title="Motorista"
        description="Local atual do motorista"
      />
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
