// screens/AdminScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const AdminScreen = ({ navigation }) => {
  const handleAddMedicine = () => {
    // Naviguer vers l'interface d'ajout de médicament
    navigation.navigate('AddMedicine');
  };

  const handleManagePharmacies = () => {
    // Naviguer vers l'interface de gestion des pharmacies
    navigation.navigate('ManagePharmacies');
  };

  const handleViewStats = () => {
    // Naviguer vers l'interface de visualisation des statistiques
    navigation.navigate('ViewStats');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
        <Text style={styles.headerTextGreen}>Géo</Text>
        <Text style={styles.headerTextBlue}>pharma</Text>
      </Text>
      <Text style={styles.pageTitle}>Page Administrateur</Text>
      <TouchableOpacity style={styles.button} onPress={handleAddMedicine}>
        <Text style={styles.buttonText}>Ajouter un médicament</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleManagePharmacies}>
        <Text style={styles.buttonText}>Gérer les pharmacies</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleViewStats}>
        <Text style={styles.buttonText}>Voir les statistiques</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerTextGreen: {
    color: 'green',
  },
  headerTextBlue: {
    color: 'blue',
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  button: {
    marginVertical: 10,
    padding: 16,
    backgroundColor: 'blue',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AdminScreen;
