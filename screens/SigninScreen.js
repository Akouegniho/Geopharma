import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SigninScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez entrer votre email et mot de passe.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/login', {
        email,
        password,
      });

      if (response.status === 200) {
        const { token } = response.data;

        // Stocker le token dans AsyncStorage
        await AsyncStorage.setItem('authToken', token);
        
        Alert.alert('Succès', 'Connexion réussie!');
        navigation.navigate('Welcome'); // Redirection vers l'écran d'accueil ou autre après connexion
      } else {
        Alert.alert('Erreur', response.data.message);
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la connexion.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Se connecter" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
});

export default SigninScreen;
