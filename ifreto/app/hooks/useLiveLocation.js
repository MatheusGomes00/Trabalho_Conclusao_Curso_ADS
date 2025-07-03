// tg-master/ifreto/app/hooks/useLiveLocation.js
import * as Location from 'expo-location';
import { useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';

export default function useLiveLocation(servicoId, ativo = false) {
  useEffect(() => {
    let interval;

    const startLocationTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      interval = setInterval(async () => {
        const token = await AsyncStorage.getItem('token');
        const location = await Location.getCurrentPositionAsync({});
        await axios.post(`${API_URL}/api/localizacao/${servicoId}`, {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }, 5000); // a cada 5 segundos
    };

    if (ativo && servicoId) {
      startLocationTracking();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [servicoId, ativo]);
}
    