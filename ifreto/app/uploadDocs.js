import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet, Alert, Dimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Cabecalho from '../components/Cabecalho';
import Rodape from '../components/Rodape';
import { API_URL } from '../config';

import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';


const { width } = Dimensions.get('window');

const ReceberEnviarDocs = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [fotoFrente, setFotoFrente] = useState(null);
  const [fotoVerso, setFotoVerso] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const [mostrarCamera, setMostrarCamera] = useState(false);
  const [tipoFoto, setTipoFoto] = useState(null);
  const cameraRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  // Altere capturarFoto para apenas abrir a câmera
  const capturarFoto = (tipo) => {
    if (!permission) {
      Alert.alert('Permissão negada', 'Acesso à câmera é necessário.');
      return;
    }
    setTipoFoto(tipo);
    setMostrarCamera(true);
  };

  const tirarFoto = async () => {
    if (cameraRef.current) {
      const foto = await cameraRef.current.takePictureAsync({ quality: 0.5 });
      const imagemManipulada = await ImageManipulator.manipulateAsync(
        foto.uri,
        [],
        { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
      );
      if (tipoFoto === 'frente') setFotoFrente(imagemManipulada);
      else if (tipoFoto === 'verso') setFotoVerso(imagemManipulada);
      else setSelfie(imagemManipulada);
      setMostrarCamera(false);
      setTipoFoto(null);
    }
  };

  const enviarFotos = async () => {
    if (!fotoFrente || !fotoVerso || !selfie) {
      Alert.alert('Erro', 'Todas as imagens são obrigatórias.');
      return;
    }

    const formData = new FormData();
    formData.append('refDocFrente', {
      uri: fotoFrente.uri,
      name: 'frente.jpg',
      type: 'image/jpeg',
    });
    formData.append('refDocVerso', {
      uri: fotoVerso.uri,
      name: 'verso.jpg',
      type: 'image/jpeg',
    });
    formData.append('refSelfie', {
      uri: selfie.uri,
      name: 'selfie.jpg',
      type: 'image/jpeg',
    });

    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(`${API_URL}/api/docs/enviarArqv`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      Alert.alert('Sucesso', 'Documentos enviados com sucesso!');
      router.replace('/motorista');
    } catch (error) {
      console.error('Erro ao enviar documentos:', error);
      Alert.alert('Erro', 'Falha ao enviar documentos.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Cabecalho />
      {mostrarCamera ? (
        <View style={{ flex: 1 }}>
          <CameraView
            ref={cameraRef}
            style={{ flex: 1, justifyContent: 'flex-end' }}
            facing={'back'}
          />
          <TouchableOpacity
            style={{
              alignSelf: 'center',
              marginBottom: 30,
              backgroundColor: '#fff',
              padding: 20,
              borderRadius: 50,
            }}
            onPress={tirarFoto}
          >
            <Ionicons name="camera" size={40} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 40,
              right: 20,
              backgroundColor: '#fff',
              padding: 10,
              borderRadius: 20,
            }}
            onPress={() => setMostrarCamera(false)}
          >
            <Ionicons name="close" size={30} color="#007AFF" />
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {permission === false && (
            <Text style={{ color: 'red', textAlign: 'center', marginBottom: 10 }}>
              Permissão da câmera negada. Ative nas configurações do dispositivo.
            </Text>
          )}

          <TouchableOpacity
            style={styles.card}
            onPress={() => capturarFoto('frente')}
            activeOpacity={0.8}
            disabled={!permission}
          >
            <Ionicons name="camera-outline" size={Math.round(width * 0.09)} color="#007AFF" />
            <Text style={styles.cardTitle}>Foto da CNH (Frente)</Text>
            <Text style={styles.cardSubtitle}>Capture a frente do documento</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => capturarFoto('verso')}
            activeOpacity={0.8}
            disabled={!permission}
          >
            <Ionicons name="camera-outline" size={Math.round(width * 0.09)} color="#007AFF" />
            <Text style={styles.cardTitle}>Foto da CNH (Verso)</Text>
            <Text style={styles.cardSubtitle}>Capture o verso do documento</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => capturarFoto('selfie')}
            activeOpacity={0.8}
            disabled={!permission}
          >
            <Ionicons name="person-circle-outline" size={Math.round(width * 0.09)} color="#007AFF" />
            <Text style={styles.cardTitle}>Selfie com CNH</Text>
            <Text style={styles.cardSubtitle}>Tire uma selfie segurando a CNH, você pode pedir para outra pessoa tirar a foto</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={enviarFotos}
            activeOpacity={0.8}
            disabled={!permission}
          >
            <Ionicons name="cloud-upload-outline" size={Math.round(width * 0.09)} color="#007AFF" />
            <Text style={styles.cardTitle}>Enviar Documentos</Text>
            <Text style={styles.cardSubtitle}>Enviar para validação</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
      <Rodape />
    </SafeAreaView>
  );
}

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
    textAlign: 'center',
  },
});

export default ReceberEnviarDocs;