import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const PaymentScreen = ({ route, navigation }) => {
  const { 
    pharmacyId = '', 
    productId = '', 
    quantity = 1, 
    unitPrice = 1, 
    totalPrice = 1 
  } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [qrCode, setQrCode] = useState(null);

  useEffect(() => {
    const processPayment = async () => {
      try {
        if (
          !pharmacyId || 
          !productId || 
          quantity <= 0 || 
          unitPrice <= 0 || 
          totalPrice <= 0 || 
          isNaN(quantity) || 
          isNaN(unitPrice) || 
          isNaN(totalPrice)
        ) {
          throw new Error('Toutes les valeurs doivent être valides et positives.');
        }

        const paymentResponse = await makePayment({
          pharmacyId,
          productId,
          quantity,
          unitPrice,
          totalPrice,
        });

        if (paymentResponse.ok) {
          const responseData = await paymentResponse.json();
          setQrCode(responseData.qrCode);
        } else {
          const errorData = await paymentResponse.json();
          handlePaymentError(errorData.message || 'Erreur lors du paiement.');
        }
      } catch (error) {
        handlePaymentError(error.message);
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  }, [pharmacyId, productId, quantity, unitPrice, totalPrice]);

  const makePayment = async (paymentData) => {
    return await fetch('http://localhost:3000/api/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pharmacyId: paymentData.pharmacyId,
        productId: paymentData.productId,
        quantity: paymentData.quantity,
        unitPrice: paymentData.unitPrice,
        totalPrice: paymentData.totalPrice,
      }),
    });
  };

  const handlePaymentError = (message) => {
    console.error('Erreur lors du traitement du paiement:', message);
    Alert.alert('Erreur', 'Une erreur est survenue lors du paiement: ' + message);
    navigation.goBack();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Traitement du paiement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Paiement</Text>
      <Text style={styles.detailText}>Pharmacie ID: {pharmacyId}</Text>
      <Text style={styles.detailText}>Produit ID: {productId}</Text>
      <Text style={styles.detailText}>Quantité: {quantity}</Text>
      <Text style={styles.detailText}>Prix total: {totalPrice} €</Text>
      {qrCode ? (
        <View style={styles.qrContainer}>
          <QRCode value={qrCode} size={200} />
          <Text style={styles.qrText}>Scannez ce code QR pour plus de détails.</Text>
        </View>
      ) : (
        <Text style={styles.errorText}>Erreur lors de la génération du code QR.</Text>
      )}
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
  loadingText: {
    fontSize: 18,
    color: '#0066cc',
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default PaymentScreen;
