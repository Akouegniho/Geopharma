import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import QRCode from 'react-native-qrcode-svg';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReservationScreen = ({ route, navigation }) => {
  const { pharmacyId, productId, details } = route.params;
  const [quantity, setQuantity] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleCalculateTotal();
  }, [quantity]);

  const handleCalculateTotal = useCallback(() => {
    const price = parseFloat(details.produit_prix);
    const qty = parseInt(quantity, 10);
    setTotalPrice(!isNaN(price) && !isNaN(qty) && qty > 0 ? price * qty : 0);
  }, [details.produit_prix, quantity]);

  const handlePayment = useCallback(async () => {
    if (totalPrice <= 0 || quantity <= 0) {
      Alert.alert('Erreur', 'Veuillez entrer une quantité valide.');
      return;
    }

    setLoading(true);

    try {
      

      const response = await axios.post(
        'http://localhost:3000/api/reservation',
        {
          pharmacyId,
          productId,
          quantity,
          unitPrice: details.produit_prix,
          totalPrice,
        },
        {
          
        }
      );

      if (response.data.qrCode) {
        setQrCode(response.data.qrCode);
        // Redirection vers la page de paiement avec les détails nécessaires
        navigation.navigate('Payment', {
          pharmacyId,
          productId,
          quantity,
          totalPrice,
          qrCode: response.data.qrCode,
        });
      } else {
        Alert.alert('Erreur', 'Le paiement a échoué.');
        navigation.navigate('Payment'); // Redirige vers la page de paiement en cas d'échec
      }
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      Alert.alert('Erreur', `Une erreur est survenue lors du paiement: ${error.response?.data?.message || error.message}`);
      navigation.navigate('Payment'); // Redirige vers la page de paiement en cas d'erreur
    } finally {
      setLoading(false);
    }
  }, [navigation, pharmacyId, productId, quantity, totalPrice, details.produit_prix]);

  const handleGetDirections = useCallback(() => {
    const { latitude, longitude } = details;
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(googleMapsUrl);
  }, [details]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Réservation pour {details.produit_nom}</Text>
      <Text style={styles.detailText}>Prix unitaire: {details.produit_prix} €</Text>
      <TextInput
        style={styles.input}
        placeholder="Quantité"
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
      />
      <Text style={styles.detailText}>Prix total: {totalPrice} €</Text>
      <TouchableOpacity style={styles.button} onPress={handlePayment} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Payer</Text>
        )}
      </TouchableOpacity>
      {qrCode && (
        <View style={styles.qrContainer}>
          <QRCode value={qrCode} size={200} />
          <Text style={styles.qrText}>Scannez ce code QR pour plus de détails.</Text>
        </View>
      )}
      <TouchableOpacity style={styles.button} onPress={handleGetDirections}>
        <Text style={styles.buttonText}>Itinéraire</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e6f7ff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0066cc',
    textAlign: 'center',
  },
  detailText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#003366',
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#009933',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#009933',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  qrContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  qrText: {
    fontSize: 16,
    color: '#003366',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default ReservationScreen;
