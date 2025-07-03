import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

export default function AcompanharEnvio() {
  return (
    <View style={[styles.map, { backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' }]}> 
      <Text style={{ color: '#888', fontSize: 16 }}>Mapa não suportado no navegador</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    marginTop: 10,
    borderRadius: 10,
  },
});
