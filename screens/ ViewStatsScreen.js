// screens/ViewStatsScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ViewStatsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Voir les Statistiques</Text>
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

export default ViewStatsScreen;
