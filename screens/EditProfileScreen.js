import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditProfileScreen = () => {
  const [profile, setProfile] = useState({
    nom: '',
    prenom: '',
    email: '',
  });

  const fetchUserProfile = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId'); // ID de l'utilisateur depuis le stockage
      const response = await fetch(`http://localhost:3000/api/profile/${userId}`);
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      Alert.alert('Erreur', 'Impossible de récupérer le profil.');
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleSave = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await fetch(`http://localhost:3000/api/profile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du profil');
      }

      const updatedData = await response.json();

      // Si la mise à jour a été effectuée avec succès, on affiche une alerte de succès
      Alert.alert('Succès', 'Votre profil a été mis à jour avec succès.', [
        {
          text: 'OK',
          onPress: () => {
            // Optionnel : Effectuer des actions supplémentaires après la confirmation
            console.log('Mise à jour confirmée');
          },
        },
      ]);

      // Met à jour le profil local avec les données renvoyées
      setProfile(updatedData);
    } catch (error) {
      console.error('Erreur:', error);
      Alert.alert('Erreur', 'Impossible de mettre à jour le profil.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nom</Text>
      <TextInput
        style={styles.input}
        value={profile.nom}
        onChangeText={(text) => setProfile({ ...profile, nom: text })}
      />

      <Text style={styles.label}>Prénom</Text>
      <TextInput
        style={styles.input}
        value={profile.prenom}
        onChangeText={(text) => setProfile({ ...profile, prenom: text })}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={profile.email}
        onChangeText={(text) => setProfile({ ...profile, email: text })}
      />

      <Button title="Enregistrer" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
  },
});

export default EditProfileScreen;
