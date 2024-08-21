import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ReservationsScreen = ({ navigation }) => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                // Récupération des données depuis l'API
                const response = await fetch('http://localhost:3000/api/reservations', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        // Ajoutez des headers d'autorisation si nécessaire
                    },
                });
    
                // Vérifiez le statut de la réponse
                if (!response.ok) {
                    throw new Error(`Erreur lors de la récupération des réservations: ${response.statusText}`);
                }
    
                // Parsez les données JSON de la réponse
                const data = await response.json();
    
                // Vérifiez que les données sont bien sous forme de tableau
                if (!Array.isArray(data)) {
                    throw new Error('Les données récupérées ne sont pas sous forme de tableau.');
                }
    
                // Mettez à jour l'état avec les réservations récupérées
                setReservations(data);
            } catch (error) {
                // Gérer l'erreur et afficher un message à l'utilisateur
                console.error('Erreur:', error.message);
                Alert.alert('Erreur', `Une erreur est survenue : ${error.message}`);
            } finally {
                // Assurez-vous que le chargement est terminé
                setLoading(false);
            }
        };
    
        // Appeler la fonction de récupération des réservations
        fetchReservations();
    }, []);
    
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="green" />
                <Text style={styles.loadingText}>Chargement des réservations...</Text>
            </View>
        );
    }

    const renderReservationItem = ({ item }) => (
        <View style={styles.pharmacyContainer}>
            <Text style={styles.pharmacyName}>{item.name}</Text>
            {item.reservations.map((reservation, index) => (
                <View key={index} style={styles.reservationItem}>
                    <Text style={styles.reservationDetail}>Médicament : {reservation.medicationName}</Text>
                    <Text style={styles.reservationDetail}>Quantité : {reservation.quantity}</Text>
                    <Text style={styles.reservationDetail}>Date : {new Date(reservation.date).toLocaleDateString()}</Text>
                </View>
            ))}
            <TouchableOpacity
                style={styles.routeButton}
                onPress={() => navigation.navigate('RouteScreen', { pharmacyId: item.pharmacyId })}
            >
                <Ionicons name="navigate" size={24} color="white" />
                <Text style={styles.routeButtonText}>Voir l'itinéraire</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <FlatList
            data={reservations}
            keyExtractor={(item) => item.pharmacyId.toString()}
            renderItem={renderReservationItem}
            contentContainerStyle={styles.container}
            ListEmptyComponent={<Text style={styles.noReservationsText}>Aucune réservation trouvée.</Text>}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: 'white',
        flexGrow: 1,
    },
    pharmacyContainer: {
        marginBottom: 20,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        paddingBottom: 10,
    },
    pharmacyName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'green',
        marginBottom: 10,
    },
    reservationItem: {
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        marginBottom: 8,
    },
    reservationDetail: {
        fontSize: 16,
        color: 'black',
    },
    routeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: 'blue',
        borderRadius: 8,
        marginTop: 10,
    },
    routeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 10,
    },
    noReservationsText: {
        fontSize: 18,
        color: 'gray',
        textAlign: 'center',
        marginTop: 50,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
        color: 'gray',
        marginTop: 10,
    },
});

export default ReservationsScreen;
