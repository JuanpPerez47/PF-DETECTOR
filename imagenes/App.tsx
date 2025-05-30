import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, ScrollView, Image, Platform, PermissionsAndroid
} from 'react-native';
import axios from 'axios';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Tts from 'react-native-tts';

import descripciones from './proma'; // <-- Importar las descripciones

const isValidImageUrl = (url) => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname.toLowerCase().split('?')[0];
    const extList = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
    const extensions = pathname.split('.').slice(1);
    return extensions.some(ext => extList.includes(ext));
  } catch {
    return false;
  }
};

const App = () => {
  const [ip, setIp] = useState('');
  const [puerto, setPuerto] = useState('');
  const [imagenUri, setImagenUri] = useState(null);
  const [imagenUrl, setImagenUrl] = useState('');
  const [respuesta, setRespuesta] = useState(null);
  const [imagenProcesada, setImagenProcesada] = useState(null);

  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
    }
    Tts.setDefaultLanguage('es-ES');
    Tts.setDefaultRate(0.5);
  }, []);

  const speakResponse = (predictions) => {
  if (predictions?.length > 0) {
    const speechText = predictions.map(item => {
      const cleanClassName = item.class_name.replace(/[_*/#"]/g, '');
      const descripcion = descripciones[item.class_name] || cleanClassName;
      return `La imagen se clasifica como: ${cleanClassName} con una probabilidad de ${(item.confidence * 100).toFixed(2)}%. ${descripcion}.`;
    }).join(' ');
    Tts.speak(speechText);
  }
};

  const handleImageResponse = (response) => {
    if (response?.assets?.[0]?.uri) {
      setImagenUri(response.assets[0].uri);
      setImagenUrl('');
      setRespuesta(null);
      setImagenProcesada(null);
    }
  };

  const tomarFoto = () => {
    launchCamera({ mediaType: 'photo', quality: 0.7 }, handleImageResponse);
  };

  const seleccionarImagen = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, handleImageResponse);
  };

  const enviarImagen = async () => {
    if (!ip || !puerto) {
      Alert.alert('Error', 'Ingresa IP y puerto del servidor.');
      return;
    }

    if (!imagenUri && !isValidImageUrl(imagenUrl)) {
      Alert.alert('Error', 'Selecciona o toma una imagen o proporciona una URL válida de imagen.');
      return;
    }

    try {
      let response;

      if (imagenUri) {
        const formData = new FormData();
        formData.append('file', {
          uri: imagenUri,
          type: 'image/jpeg',
          name: 'foto.jpg',
        });

        response = await axios.post(`http://${ip}:${puerto}/predict/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else if (isValidImageUrl(imagenUrl)) {
        response = await axios.post(`http://${ip}:${puerto}/predict_url/`, {
          url: imagenUrl,
        });
      }

      setRespuesta(response.data.predictions);
      setImagenProcesada(response.data.image); // Base64 con imagen anotada
      speakResponse(response.data.predictions);
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar la imagen: ' + (error.response?.data?.detail || error.message));
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('./assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Clasificador de Imágenes</Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
        <TextInput
          style={[styles.input, { flex: 1, marginRight: 5, color: 'black' }]}
          placeholder="IP del servidor"
          value={ip}
          onChangeText={setIp}
          placeholderTextColor="black"
        />
        <TextInput
          style={[styles.input, { flex: 1, marginLeft: 5, color: 'black' }]}
          placeholder="Puerto"
          value={puerto}
          onChangeText={setPuerto}
          placeholderTextColor="black"
          keyboardType="numeric"
        />
      </View>

      <Text style={styles.subtitle}>1. Escoge una imagen:</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={tomarFoto}>
          <Text style={styles.buttonText}>📷 Cámara</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={seleccionarImagen}>
          <Text style={styles.buttonText}>🖼️ Galería</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>2. O usa un enlace:</Text>
      <TextInput
        style={styles.input}
        placeholder="URL de la imagen"
        value={imagenUrl}
        onChangeText={(text) => {
          setImagenUrl(text);
          if (text.length > 0) setImagenUri(null);
          setRespuesta(null);
          setImagenProcesada(null);
        }}
        autoCapitalize="none"
        autoCorrect={false}
      />

      {/* Imagen Original */}
      {imagenUri && (
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Imagen Original</Text>
          <Image source={{ uri: imagenUri }} style={styles.preview} />
        </View>
      )}

      {/* Imagen desde URL */}
      {!imagenUri && isValidImageUrl(imagenUrl) && (
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Imagen Original (URL)</Text>
          <Image source={{ uri: imagenUrl }} style={styles.preview} />
        </View>
      )}

      {/* Imagen procesada con bounding boxes (base64) */}
      {imagenProcesada && (
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Imagen con Bounding Boxes</Text>
          <Image source={{ uri: imagenProcesada }} style={styles.preview} />
        </View>
      )}

      <TouchableOpacity style={styles.analyzeButton} onPress={enviarImagen}>
        <Text style={styles.analyzeText}>🔍 Clasificar Imagen</Text>
      </TouchableOpacity>

      {respuesta && (
  <View style={styles.resultsContainer}>
    <Text style={styles.resultsTitle}>Resultados:</Text>
    {respuesta.map((item, idx) => {
      const cleanClassName = item.class_name.replace(/[_*/#"]/g, '');
      const descripcion = descripciones[item.class_name] || cleanClassName;
      return (
        <View key={idx} style={{ marginBottom: 12 }}>
          <Text style={styles.resultItem}>
            • {cleanClassName}: {(item.confidence * 100).toFixed(2)}%
          </Text>
          <Text style={[styles.resultItem, { marginLeft: 16, marginTop: 4 }]}>
            {descripcion}
          </Text>
        </View>
      );
    })}
  </View>
)}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  logo: {
    width: 300,
    height: 200,
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    marginVertical: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    marginVertical: 8,
    fontWeight: '600',
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  preview: {
    width: 200,
    height: 200,
    marginVertical: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  analyzeButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginBottom: 20,
  },
  analyzeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    width: '100%',
    paddingTop: 20,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultItem: {
    fontSize: 16,
    marginVertical: 4,
  },
});

export default App;
