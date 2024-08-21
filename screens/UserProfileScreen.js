import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserProfileScreen = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      
      // Requête à l'API pour récupérer les informations utilisateur
      const response = await fetch(`http://localhost:3000/api/userinfo`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          
        },
      });
  
      // Vérification si la réponse est correcte (statut 200)
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des informations utilisateur');
      }
  
      // Conversion de la réponse en JSON
      const data = await response.json();
  
      // Mise à jour des informations utilisateur dans l'état
      setUserInfo(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des informations utilisateur:', error);
  
      // Affichage d'une alerte en cas d'erreur
      Alert.alert('Erreur', "Une erreur s'est produite lors de la récupération des informations utilisateur. Veuillez réessayer plus tard.");
    }
  };

  return (
    <View style={styles.container}>
      {userInfo ? (
        <>
          <Text style={styles.text}>Nom: {userInfo.nom}</Text>
          <Text style={styles.text}>Prénom: {userInfo.prenom}</Text>
          <Text style={styles.text}>Email: {userInfo.email}</Text>
        </>
      ) : (
        <Text style={styles.text}>Chargement des informations utilisateur...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  text: {
    fontSize: 18,
    marginBottom: 8,
  },
});

export default UserProfileScreen;
