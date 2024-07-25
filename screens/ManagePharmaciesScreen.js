// screens/ManagePharmaciesScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ManagePharmaciesScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Gérer les Pharmacies</Text>
      {/* Ajoutez votre logique ici */}
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
});

export default ManagePharmaciesScreen;
