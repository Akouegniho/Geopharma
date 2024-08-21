import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Animated, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';
import * as Linking from 'expo-linking';

const PharmacyDetailsScreen = ({ route, navigation }) => {
  const { pharmacyId, productId } = route.params;
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(null);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/pharmacy/${pharmacyId}/product/${productId}`);
        if (response.data) {
          setDetails(response.data);
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
          }).start();
        } else {
          Alert.alert('Erreur', 'Détails non trouvés.');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des détails:', error);
        Alert.alert('Erreur', 'Erreur lors de la récupération des détails.');
      } finally {
        setLoading(false);
      }
    };

    if (pharmacyId && productId) {
      fetchDetails();
    } else {
      setLoading(false);
      Alert.alert('Erreur', 'ID de pharmacie ou de produit manquant.');
    }
  }, [pharmacyId, productId, fadeAnim]);

  const handleGetDirections = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${details.latitude},${details.longitude}`;
      Linking.openURL(googleMapsUrl);
    } catch (error) {
      console.error('Erreur lors de la récupération de la position:', error);
      Alert.alert('Erreur', 'Erreur lors de la récupération de la position.');
    }
  };

  const handleReservation = () => {
    navigation.navigate('Reservation', { pharmacyId, productId, details });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!details) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Aucun détail disponible.</Text>
      </View>
    );
  }

  return (
    <Animated.View style={{ ...styles.container, opacity: fadeAnim }}>
      <Text style={styles.heading}>{details.pharmacie_nom}</Text>
      <Text style={styles.detailText}>Produit recherché: {details.produit_nom}</Text>
      <Text style={styles.detailText}>Description: {details.produit_description}</Text>
      <Text style={styles.detailText}>Prix unitaire: {details.produit_prix} €</Text>
      <Text style={styles.detailText}>Adresse: {details.pharmacie_adresse}</Text>
      <Text style={styles.detailText}>Téléphone: {details.pharmacie_telephone}</Text>
      
      <TouchableOpacity style={styles.button} onPress={handleReservation}>
        <Text style={styles.buttonText}>Réserver</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e6f7ff',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0066cc',
    textAlign: 'center',
  },
  detailText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#003366',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e6f7ff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e6f7ff',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  button: {
    backgroundColor: '#009933',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PharmacyDetailsScreen;
