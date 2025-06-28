import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { API_URL } from '../config';

const Perfil = () => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    cidade: '',
    estado: '',
    tipo: '',
    cnh: '',
    tipoVeiculo: '',
  });

  useEffect(() => {
    const fetchDadosUsuario = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) throw new Error('Token não encontrado');
        const decoded = jwtDecode(token);
        const userId = decoded.id;

        const response = await axios.get(`${API_URL}/api/user/buscar/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const dados = response.data;
        setUsuario(dados);
        setForm({
          nome: dados.nome || '',
          email: dados.email || '',
          telefone: dados.telefone || '',
          cidade: dados.endereco?.cidade || '',
          estado: dados.endereco?.estado || '',
          tipo: dados.tipo || '',
          cnh: dados.motoristaDetalhes?.cnh || '',
          tipoVeiculo: dados.motoristaDetalhes?.tipoVeiculo || '',
        });
      } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        Alert.alert('Erro', 'Não foi possível carregar os dados do usuário.');
      } finally {
        setLoading(false);
      }
    };

    fetchDadosUsuario();
  }, []);

  const handleChange = (campo, valor) => {
    setForm(prev => ({ ...prev, [campo]: valor }));
  };

  const handleSalvar = async () => {
    try {

      const body = {
        nome: form.nome,
        email: form.email,
        telefone: form.telefone,
        endereco: {
            cidade: form.cidade,
            estado: form.estado
        },
        motoristaDetalhes: {
            cnh: form.cnh,
            tipoVeiculo: form.tipoVeiculo
        }
      }
      const token = await AsyncStorage.getItem('token');
      await axios.put(`${API_URL}/api/user/editar`, body, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Sucesso', 'Dados atualizados com sucesso.');
    } catch (error) {
      console.error('Erro ao atualizar cadastro:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o cadastro.');
    }
  };

  const handleExcluir = async () => {
    Alert.alert(
        'Confirmar exclusão',
        'Tem certeza que deseja excluir sua conta? Esta ação não poderá ser desfeita.',
        [
        { text: 'Cancelar', style: 'cancel' },
        {
            text: 'Excluir',
            style: 'destructive',
            onPress: async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) throw new Error('Token não encontrado');
                const decoded = jwtDecode(token);
                const userId = decoded.id;

                await axios.delete(`${API_URL}/api/user/excluir/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
                });

                await AsyncStorage.removeItem('token');
                Alert.alert('Conta excluída', 'Sua conta foi removida com sucesso.');
                router.replace('/'); // volta à tela de login
            } catch (error) {
                console.error('Erro ao excluir conta:', error);
                Alert.alert('Erro', 'Não foi possível excluir sua conta.');
            }
            },
        },
        ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Editar Perfil</Text>
        <View style={styles.fieldGroup}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
            style={styles.input}
            placeholder="Nome"
            value={form.nome}
            onChangeText={(text) => handleChange('nome', text)}
            />
        </View>
        
        <View style={styles.fieldGroup}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
                style={styles.input}
                placeholder="E-mail"
                value={form.email}
                onChangeText={(text) => handleChange('email', text)}
                keyboardType="email-address"
            />
        </View>

        <View style={styles.fieldGroup}>
            <Text style={styles.label}>Telefone</Text>
            <TextInput
                style={styles.input}
                placeholder="Telefone"
                value={form.telefone}
                onChangeText={(text) => handleChange('telefone', text)}
                keyboardType="phone-pad"
            />
        </View>

        <View style={styles.fieldGroup}>
            <Text style={styles.label}>Cidade</Text>
            <TextInput
                style={styles.input}
                placeholder="Cidade"
                value={form.cidade}
                onChangeText={(text) => handleChange('cidade', text)}
            />
        </View>

        <View style={styles.fieldGroup}>
            <Text style={styles.label}>Cidade</Text>
            <TextInput
                style={styles.input}
                placeholder="Estado"
                value={form.estado}
                onChangeText={(text) => handleChange('estado', text)}
            />
        </View>

        {form.tipo === 'motorista' && (
            <>
            <View style={styles.fieldGroup}>
                <Text style={styles.label}>CNH</Text>
                <TextInput
                    style={styles.input}
                    placeholder="CNH"
                    value={form.cnh}
                    onChangeText={(text) => handleChange('cnh', text)}
                />
            </View>

            <View style={styles.fieldGroup}>
                <Text style={styles.label}>Tipo Veículo</Text>
                <Picker
                    selectedValue={form.tipoVeiculo}
                    onValueChange={(value) => handleChange('tipoVeiculo', value)}
                    style={styles.input}
                >
                    <Picker.Item label="Selecione o veículo" value="" />
                    <Picker.Item label="Caminhonete" value="caminhonete" />
                    <Picker.Item label="Van" value="van" />
                    <Picker.Item label="Caminhão" value="caminhao" />
                    <Picker.Item label="Outro" value="outro" />
                </Picker>
            </View>
            </>
        )}

        <TouchableOpacity style={styles.button} onPress={handleSalvar}>
            <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleExcluir}>
            <Text style={styles.buttonText}>Excluir conta</Text>
        </TouchableOpacity>
        </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fieldGroup: {
   marginBottom: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
    color: '#333',
  },
});

export default Perfil;