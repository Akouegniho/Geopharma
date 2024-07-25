// screens/AddMedicineScreen.js
import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

const AddMedicineScreen = () => {
  const handleAddMedicine = () => {
    // Logique pour ajouter le médicament
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Ajouter un Médicament</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom du médicament"
        // Ajoutez d'autres props si nécessaire
      />
      <TextInput
        style={styles.input}
        placeholder="Dosage"
        // Ajoutez d'autres props si nécessaire
      />
      <TextInput
        style={styles.input}
        placeholder="Instructions"
        // Ajoutez d'autres props si nécessaire
      />
      <TextInput
        style={styles.input}
        placeholder="Effets secondaires"
        // Ajoutez d'autres props si nécessaire
      />
      <TouchableOpacity style={styles.button} onPress={handleAddMedicine}>
        <Text style={styles.buttonText}>Ajouter</Text>
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
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
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

export default AddMedicineScreen;
