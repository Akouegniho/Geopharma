import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assurez-vous d'avoir installé @expo/vector-icons

const WelcomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigation.navigate('Search', { query: searchQuery });
    } else {
      Alert.alert('Erreur', 'Veuillez entrer un terme de recherche.');
    }
  };

  const handleMenuPress = () => {
    // Code pour ouvrir le menu ou naviguer vers une autre page
    Alert.alert('Menu', 'Fonctionnalité du menu à implémenter.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appName}>
          <Text style={styles.appNameGreen}>Géo</Text>
          <Text style={styles.appNameBlue}>pharma</Text>
        </Text>
        
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher des médicaments..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
      />

      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>Rechercher</Text>
      </TouchableOpacity>

      <ScrollView style={styles.carousel}>
        <TouchableOpacity style={styles.articleItem}>
          <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.articleImage} />
          <Text style={styles.articleTitle}>Article 1</Text>
          <Text style={styles.articlePrice}>10€</Text>
          <TouchableOpacity style={styles.paymentButton}>
            <Text style={styles.paymentButtonText}>Payer</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        <TouchableOpacity style={styles.articleItem}>
          <Image source={{ uri: 'https://www.apothicaire-pharmacie.com/media/catalog/product/cache/6a3c24cc3e7a0db8d1f5b96edcf88f7e/1/1/1121.jpg' }} style={styles.articleImage} />
          <Text style={styles.articleTitle}>Article 2</Text>
          <Text style={styles.articlePrice}>15€</Text>
          <TouchableOpacity style={styles.paymentButton}>
            <Text style={styles.paymentButtonText}>Payer</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        <TouchableOpacity style={styles.articleItem}>
          <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.articleImage} />
          <Text style={styles.articleTitle}>Article 3</Text>
          <Text style={styles.articlePrice}>20€</Text>
          <TouchableOpacity style={styles.paymentButton}>
            <Text style={styles.paymentButtonText}>Payer</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  appNameGreen: {
    color: 'green',
  },
  appNameBlue: {
    color: 'blue',
  },
  menuIcon: {
    padding: 10,
  },
  searchInput: {
    marginTop: 16,
    padding: 8,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
  },
  searchButton: {
    marginTop: 16,
    padding: 10,
    backgroundColor: 'green',
    borderRadius: 8,
    alignItems: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  carousel: {
    marginTop: 16,
  },
  articleItem: {
    padding: 16,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  articleImage: {
    width: 150,
    height: 150,
    marginBottom: 8,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  articlePrice: {
    fontSize: 16,
    color: 'green',
    marginBottom: 8,
  },
  paymentButton: {
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 8,
    alignItems: 'center',
  },
  paymentButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default WelcomeScreen;
