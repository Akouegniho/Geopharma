import React, { useState } from 'react';
import { View, Button, TextInput, StyleSheet, Modal, TouchableOpacity, FlatList, Text, Alert } from 'react-native';
import Checkbox from 'expo-checkbox';

const countries = [
  { label: 'France', value: 'France' },
  { label: 'États-Unis', value: 'USA' },
  { label: 'Canada', value: 'Canada' },
  // Ajoutez d'autres pays ici
];

const SigninScreen = ({ navigation }) => {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [pays, setPays] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdult, setIsAdult] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSignin = async () => {
    if (!email || !password || !nom || !prenom || !pays) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }
    if (!isAdult) {
      Alert.alert('Erreur', 'Vous devez confirmer que vous avez au moins 18 ans.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom,
          prenom,
          email,
          password,
          
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigation.navigate('Welcome');
      } else {
        Alert.alert('Erreur', data.message || 'Une erreur est survenue.');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue.');
    }
  };

  const renderCountryItem = ({ item }) => (
    <TouchableOpacity style={styles.countryItem} onPress={() => {
      setPays(item.value);
      setModalVisible(false);
    }}>
      <Text>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={nom}
        onChangeText={(text) => setNom(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Prenom"
        value={prenom}
        onChangeText={(text) => setPrenom(text)}
      />
      <TouchableOpacity style={styles.input} onPress={() => setModalVisible(true)}>
        <Text>{pays || 'Sélectionnez un pays'}</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <View style={styles.checkboxContainer}>
        <Checkbox
          value={isAdult}
          onValueChange={setIsAdult}
        />
        <Text style={styles.label}>Je confirme avoir au moins 18 ans</Text>
      </View>
      <Button title="S'inscrire" onPress={handleSignin} />
      
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <FlatList
            data={countries}
            renderItem={renderCountryItem}
            keyExtractor={(item) => item.value}
          />
          <Button title="Fermer" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  input: {
    height: 40,
    width: '100%',
    marginBottom: 10,
    paddingHorizontal: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  label: {
    margin: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  countryItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default SigninScreen;
