import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const MapaMotorista = () => (
  <View style={[styles.map, { backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' }]}>
    <Text style={{ color: '#888', fontSize: 16 }}>Mapa não suportado no navegador</Text>
  </View>
);

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: 300,
    marginTop: 10,
    borderRadius: 10,
  },
});

export default MapaMotorista;