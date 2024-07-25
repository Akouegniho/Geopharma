import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';

const SearchScreen = ({ route, navigation }) => {
  const { query } = route.params;
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/search?product=${query}`);
        const data = await response.json();
        if (response.ok) {
          setResults(data);
        } else {
          Alert.alert('Erreur', data.message);
        }
      } catch (error) {
        Alert.alert('Erreur', 'Une erreur est survenue lors de la recherche.');
      }
    };

    fetchResults();
  }, [query]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Résultats de la recherche pour "{query}"</Text>
      <FlatList
        data={results}
        keyExtractor={(item) => item.pharmacie_telephone}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('PharmacyDetails', { pharmacy: item })}>
            <Text style={styles.itemText}>{item.pharmacie_nom}</Text>
            <Text style={styles.itemText}>{item.pharmacie_adresse}</Text>
            <Text style={styles.itemText}>{item.pharmacie_telephone}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  item: {
    padding: 16,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  itemText: {
    fontSize: 16,
  },
});

export default SearchScreen;
