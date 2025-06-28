import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { API_URL } from '../config';

const CadastroScreen = () => {
  const { control, handleSubmit, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const tipo = watch('tipo');
  const router = useRouter();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/user/usuarios`, {
        nome: data.nome,
        email: data.email,
        senha: data.senha,
        tipo: data.tipo,
        telefone: data.telefone,
        endereco: {
          cidade: data.cidade,
          estado: data.estado,
        },
        motoristaDetalhes: data.tipo === 'motorista' ? {
          cnh: data.cnh,
          tipoVeiculo: data.tipoVeiculo,
        } : undefined,
      });
      await AsyncStorage.setItem('token', response.data.token);
      Alert.alert('Sucesso', 'Usuário cadastrado!', [
        {
          text: 'OK',
          onPress: () => {
            router.replace('/');
          },
        },
      ]);
    } catch (error) {
      const errorMessage = error.response?.data?.erro || error.message || 'Erro ao cadastrar usuário';
      Alert.alert('Erro', errorMessage);
      console.error('Erro no cadastro:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Cadastro</Text>

        <Controller
          control={control}
          name="nome"
          rules={{ required: 'Nome é obrigatório', minLength: { value: 3, message: 'Mínimo 3 caracteres' } }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, errors.nome && styles.inputError]}
              placeholder="Nome"
              placeholderTextColor="#999"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.nome && <Text style={styles.error}>{errors.nome.message}</Text>}

        <Controller
          control={control}
          name="email"
          rules={{ required: 'E-mail é obrigatório', pattern: { value: /^\S+@\S+$/i, message: 'E-mail inválido' } }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="E-mail"
              placeholderTextColor="#999"
              value={value}
              onChangeText={onChange}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />
        {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

        <Controller
          control={control}
          name="senha"
          rules={{ required: 'Senha é obrigatória', minLength: { value: 6, message: 'Mínimo 6 caracteres' } }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, errors.senha && styles.inputError]}
              placeholder="Senha"
              placeholderTextColor="#999"
              value={value}
              onChangeText={onChange}
              secureTextEntry
            />
          )}
        />
        {errors.senha && <Text style={styles.error}>{errors.senha.message}</Text>}

        <Controller
          control={control}
          name="tipo"
          rules={{ required: 'Tipo é obrigatório' }}
          render={({ field: { onChange, value } }) => (
            <View style={[styles.pickerContainer, errors.tipo && styles.inputError]}>
              <Picker
                selectedValue={value}
                onValueChange={onChange}
                style={styles.picker}
              >
                <Picker.Item label="Selecione o tipo" value="" />
                <Picker.Item label="Motorista" value="motorista" />
                <Picker.Item label="Cliente" value="cliente" />
              </Picker>
            </View>
          )}
        />
        {errors.tipo && <Text style={styles.error}>{errors.tipo.message}</Text>}

        <Controller
          control={control}
          name="telefone"
          rules={{ required: 'Telefone é obrigatório', minLength: { value: 10, message: 'Telefone inválido' } }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, errors.telefone && styles.inputError]}
              placeholder="Telefone (ex.: +5511999999999)"
              placeholderTextColor="#999"
              value={value}
              onChangeText={onChange}
              keyboardType="phone-pad"
            />
          )}
        />
        {errors.telefone && <Text style={styles.error}>{errors.telefone.message}</Text>}

        <Controller
          control={control}
          name="cidade"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Cidade (opcional)"
              placeholderTextColor="#999"
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="estado"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Estado (opcional)"
              placeholderTextColor="#999"
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        {tipo === 'motorista' && (
          <>
            <Controller
              control={control}
              name="cnh"
              rules={{ required: 'CNH é obrigatória para motoristas' }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.cnh && styles.inputError]}
                  placeholder="CNH"
                  placeholderTextColor="#999"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.cnh && <Text style={styles.error}>{errors.cnh.message}</Text>}

            <Controller
              control={control}
              name="tipoVeiculo"
              rules={{ required: 'Tipo de veículo é obrigatório' }}
              render={({ field: { onChange, value } }) => (
                <View style={[styles.pickerContainer, errors.tipoVeiculo && styles.inputError]}>
                  <Picker
                    selectedValue={value}
                    onValueChange={onChange}
                    style={styles.picker}
                  >
                    <Picker.Item label="Selecione o veículo" value="" />
                    <Picker.Item label="Caminhonete" value="caminhonete" />
                    <Picker.Item label="Van" value="van" />
                    <Picker.Item label="Caminhão" value="caminhao" />
                    <Picker.Item label="Outro" value="outro" />
                  </Picker>
                </View>
              )}
            />
            {errors.tipoVeiculo && <Text style={styles.error}>{errors.tipoVeiculo.message}</Text>}
          </>
        )}
        <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Carregando...' : 'Cadastrar'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={() => router.push('/')} disabled={loading}>
          <Text style={[styles.buttonText, styles.buttonTextSecondary]}>Voltar ao Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    buttonContainer: {
      flex: 1,
      backgroundColor: '#fff',
    },
    contentContainer: {
      padding: 20,
      paddingBottom: 40,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      fontSize: 16,
      padding: 10,
      marginVertical: 10,
      borderRadius: 5,
      backgroundColor: '#fff',
    },
    inputError: {
      borderColor: 'red',
    },
    error: {
      color: 'red',
      marginBottom: 10,
    },
    pickerContainer: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      marginVertical: 10,
      backgroundColor: '#fff',
      overflow: 'hidden',
      height: 50,
      justifyContent: 'center',
    },
    picker: {
      height: 50,
      width: '100%',
      color: '#000',
      fontSize: 16,
    },
    button: {
      backgroundColor: '#007AFF',
      padding: 15,
      borderRadius: 5,
      alignItems: 'center',
      marginTop: 20,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    buttonSecondary: {
      backgroundColor: 'transparent',
      marginTop: 10,
    },
    buttonTextSecondary: {
      color: '#666',
    },
  });

export default CadastroScreen;