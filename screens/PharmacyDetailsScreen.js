import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import * as WebBrowser from 'expo-web-browser';

const PharmacyDetailsScreen = ({ navigation, route }) => {
  const { pharmacyId } = route.params;
  const [pharmacy, setPharmacy] = useState({});
  const [product, setProduct] = useState({
    nom: 'Nom du médicament ici',
    description: 'Description du médicament ici',
    prix: 'Prix du médicament ici',
  });
  const [userId, setUserId] = useState(1); // Remplacer par l'ID utilisateur réel
  const [productId, setProductId] = useState(1); // Remplacer par l'ID produit réel

  useEffect(() => {
    const fetchPharmacyDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/pharmacy/${pharmacyId}`);
        setPharmacy(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des détails de la pharmacie:', error);
      }
    };

    fetchPharmacyDetails();
  }, [pharmacyId]);

  const handleReservation = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/reserve', {
        userId,
        pharmacyId,
        productId,
      });

      if (response.status === 200) {
        Alert.alert('Succès', 'Réservation réussie!');
        // Rediriger vers la page de paiement
        navigation.navigate('Payment', { pharmacy, product });
      }
    } catch (error) {
      Alert.alert('Erreur', 'Réservation échouée!');
      console.error('Erreur lors de la réservation:', error);
    }
  };

  const handleRoute = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${pharmacy.latitude},${pharmacy.longitude}`;
    WebBrowser.openBrowserAsync(url);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          <Text style={styles.headerTextGreen}>Géo</Text>
          <Text style={styles.headerTextBlue}>pharma</Text>
        </Text>
        <Text style={styles.pharmacyName}>{pharmacy.nom}</Text>
      </View>
      <View style={styles.productContainer}>
        <Text style={styles.sectionTitle}>Nom du médicament:</Text>
        <Text>{product.nom}</Text>
        <Text style={styles.sectionTitle}>Description:</Text>
        <Text>{product.description}</Text>
        <Text style={styles.sectionTitle}>Prix:</Text>
        <Text>{product.prix}</Text>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Adresse:</Text>
          <Text>{pharmacy.adresse}</Text>
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Téléphone:</Text>
          <Text>{pharmacy.telephone}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.reserveButton} onPress={handleReservation}>
        <Text style={styles.reserveButtonText}>Réserver</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.routeButton} onPress={handleRoute}>
        <Text style={styles.routeButtonText}>Tracer l'itinéraire</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTextGreen: {
    color: 'green',
  },
  headerTextBlue: {
    color: 'blue',
  },
  pharmacyName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  productContainer: {
    marginBottom: 20,
  },
  infoContainer: {
    flex: 1,
  },
  infoSection: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontWeight: 'bold',
  },
  reserveButton: {
    marginTop: 20,
    padding: 16,
    backgroundColor: 'green',
    alignItems: 'center',
    borderRadius: 8,
  },
  reserveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  routeButton: {
    marginTop: 10,
    padding: 16,
    backgroundColor: 'blue',
    alignItems: 'center',
    borderRadius: 8,
  },
  routeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PharmacyDetailsScreen;
