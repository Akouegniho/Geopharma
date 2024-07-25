import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';

const PharmacyDetailsScreen = ({ navigation, route }) => {
  const { pharmacyId } = route.params;
  const [pharmacy, setPharmacy] = useState({});
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
      }
    } catch (error) {
      Alert.alert('Erreur', 'Réservation échouée!');
      console.error('Erreur lors de la réservation:', error);
    }
  };

  const handleRoute = () => {
    navigation.navigate('Route', { pharmacyId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          <Text style={styles.headerTextGreen}>Géo</Text>
          <Text style={styles.headerTextBlue}>pharma</Text>
        </Text>
        <Text style={styles.pharmacyName}>{pharmacy.nom}</Text>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Nom du médicament:</Text>
          <Text>Nom du médicament ici</Text>
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Dosage:</Text>
          <Text>Dosage du médicament ici</Text>
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Instructions:</Text>
          <Text>Instructions d'utilisation ici</Text>
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Effets secondaires:</Text>
          <Text>Effets secondaires possibles ici</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.reserveButton} onPress={handleReservation}>
        <Text style={styles.reserveButtonText}>Réserver</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.routeButton} onPress={handleRoute}>
        <Text style={styles.routeButtonText}>Tracer l'itinéraire</Text>
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
