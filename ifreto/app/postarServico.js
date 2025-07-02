import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useForm, Controller } from 'react-hook-form';
import React, { useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { API_URL } from '../config';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StyleSheet } from 'react-native';

const PostarServico = () => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm();
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Erro', 'Você precisa estar logado para publicar um serviço.');
        return;
      }

      const payload = {
        origem: {
          cidade: data.cidadeOrigem,
          estado: data.estadoOrigem,
          endereco: data.enderecoOrigem,
        },
        destino: {
          cidade: data.cidadeDestino,
          estado: data.estadoDestino,
          endereco: data.enderecoDestino,
        },
        tipoCarga: data.tipoCarga,
        pesoEstimado: Number(data.pesoEstimado),
        preco: Number(data.preco),
        dataAgendamento: data.dataAgendamento ? new Date(data.dataAgendamento) : undefined,
      };

      const response = await axios.post(`${API_URL}/api/servicos/criar`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert('Sucesso', 'Serviço publicado com sucesso!');
      reset();
      router.replace('/historicoCliente');
    } catch (error) {
      console.error('Erro ao publicar serviço:', error.message, error.response?.data);
      Alert.alert('Erro', error.response?.data?.message || 'Falha ao publicar serviço.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>PREENCHA OS CAMPOS ABAIXO</Text>

      <Text style={styles.label}>Origem</Text>
      <Controller
        control={control}
        name="cidadeOrigem"
        rules={{ required: 'Cidade de origem é obrigatória' }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors.cidadeOrigem && styles.inputError]}
            placeholder="Cidade"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.cidadeOrigem && <Text style={styles.error}>{errors.cidadeOrigem.message}</Text>}

      <Controller
        control={control}
        name="estadoOrigem"
        rules={{ required: 'Estado de origem é obrigatório' }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors.estadoOrigem && styles.inputError]}
            placeholder="Estado (ex.: SP)"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.estadoOrigem && <Text style={styles.error}>{errors.estadoOrigem.message}</Text>}

      <Controller
        control={control}
        name="enderecoOrigem"
        rules={{ required: 'Endereço de origem é obrigatório' }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors.enderecoOrigem && styles.inputError]}
            placeholder="Rua, numero, bairro, complemento"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.enderecoOrigem && <Text style={styles.error}>{errors.enderecoOrigem.message}</Text>}

      <Text style={styles.label}>Destino</Text>
      <Controller
        control={control}
        name="cidadeDestino"
        rules={{ required: 'Cidade de destino é obrigatória' }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors.cidadeDestino && styles.inputError]}
            placeholder="Cidade"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.cidadeDestino && <Text style={styles.error}>{errors.cidadeDestino.message}</Text>}

      <Controller
        control={control}
        name="estadoDestino"
        rules={{ required: 'Estado de destino é obrigatório' }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors.estadoDestino && styles.inputError]}
            placeholder="Estado (ex.: RJ)"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.estadoDestino && <Text style={styles.error}>{errors.estadoDestino.message}</Text>}

      <Controller
        control={control}
        name="enderecoDestino"
        rules={{ required: 'Endereço de destino é obrigatório' }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors.enderecoDestino && styles.inputError]}
            placeholder="Rua, numero, bairro, complemento"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.enderecoDestino && <Text style={styles.error}>{errors.enderecoDestino.message}</Text>}

      <Text style={styles.label}>Tipo de Carga</Text>
      <Controller
        control={control}
        name="tipoCarga"
        rules={{ required: 'Tipo de carga é obrigatório' }}
        render={({ field: { onChange, value } }) => (
          <View style={[styles.pickerContainer, errors.tipoCarga && styles.inputError]}>
            <Picker
              selectedValue={value}
              onValueChange={onChange}
              style={styles.picker}
            >
              <Picker.Item label="Selecione" value="" />
              <Picker.Item label="Mudança" value="mudanca" />
              <Picker.Item label="Entrega" value="entrega" />
              <Picker.Item label="Outro" value="outro" />
            </Picker>
          </View>
        )}
      />
      {errors.tipoCarga && <Text style={styles.error}>{errors.tipoCarga.message}</Text>}

      <Text style={styles.label}>Peso Estimado (opcional)</Text>
      <Controller
        control={control}
        name="pesoEstimado"
        rules={{
          pattern: { value: /^\d+$/, message: 'Digite apenas números' },
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors.pesoEstimado && styles.inputError]}
            placeholder="Peso em kg"
            value={value}
            onChangeText={onChange}
            keyboardType="numeric"
          />
        )}
      />
      {errors.pesoEstimado && <Text style={styles.error}>{errors.pesoEstimado.message}</Text>}

      <Text style={styles.label}>Valor (opcional)</Text>
      <Controller
        control={control}
        name="preco"
        rules={{
          pattern: { value: /^\d+(\.\d{1,2})?$/, message: 'Digite um valor válido (ex.: 500.00)' },
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors.preco && styles.inputError]}
            placeholder="Preço em reais"
            value={value}
            onChangeText={onChange}
            keyboardType="numeric"
          />
        )}
      />
      {errors.preco && <Text style={styles.error}>{errors.preco.message}</Text>}

      <Text style={styles.label}>Data de Agendamento (opcional)</Text>
        <Controller
        control={control}
        name="dataAgendamento"
        render={({ field: { onChange, value } }) => {
            const [showPicker, setShowPicker] = useState(false);

            const handleDateChange = (event, selectedDate) => {
            setShowPicker(Platform.OS === 'ios'); // Mantém picker aberto no iOS
            if (selectedDate) {
                onChange(selectedDate.toISOString()); // Envia data em formato ISO
            } else {
                onChange(undefined); // Permite limpar a data
            }
            };

            return (
            <View>
                <TouchableOpacity
                style={[styles.input, { justifyContent: 'center' }]}
                onPress={() => setShowPicker(true)}
                >
                <Text style={styles.dateText}>
                    {value ? new Date(value).toLocaleDateString('pt-BR') : 'Selecione uma data'}
                </Text>
                </TouchableOpacity>
                {showPicker && (
                <DateTimePicker
                    value={value ? new Date(value) : new Date()}
                    mode="date"
                    display={Platform.OS === 'android' ? 'calendar' : 'inline'}
                    onChange={handleDateChange}
                    minimumDate={new Date()} // Impede datas passadas
                />
                )}
            </View>
            );
        }}
        />

      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Publicar Serviço</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  inputError: {
    borderColor: 'red',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
});

export default PostarServico;