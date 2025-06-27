import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { API_URL } from '../config';

const LoginScreen = () => {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      console.log('API_URL:', API_URL);
      const response = await axios.post(`${API_URL}/api/user/login`, {
        email: data.email,
        senha: data.senha,
      });
      await AsyncStorage.setItem('token', response.data.token);
      router.replace('/home');
    } catch (error) {
      let errorMessage = 'Erro ao fazer login';
      if (error.response?.data?.erro) {
        errorMessage = Array.isArray(error.response.data.erro)
          ? error.response.data.erro.join(', ')
          : error.response.data.erro;
      } else if (error.message.includes('Network Error')) {
        errorMessage = 'Falha na conexão com o servidor';
      }
      Alert.alert('Erro', errorMessage);
      console.error('Erro no login:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <Controller
        control={control}
        name="email"
        rules={{ required: 'E-mail é obrigatório', pattern: { value: /^\S+@\S+$/i, message: 'E-mail inválido' } }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="E-mail"
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
            value={value}
            onChangeText={onChange}
            secureTextEntry
          />
        )}
      />
      {errors.senha && <Text style={styles.error}>{errors.senha.message}</Text>}

      <View style={styles.buttonContainer} >
        <Button title={loading ? 'Carregando...' : 'Entrar'} onPress={handleSubmit(onSubmit)} disabled={loading} />
      </View>
      <Button title="Cadastrar" onPress={() => router.push('/cadastro')} color="#666" />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginBottom: 5,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
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
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  inputError: {
    borderColor: 'red',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default LoginScreen;