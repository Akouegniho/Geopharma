import 'react-native-gesture-handler';
import 'react-native-reanimated';

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './screens/HomeScreen';
import SignupScreen from './screens/SignupScreen';
import SigninScreen from './screens/SigninScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import SearchScreen from './screens/SearchScreen';
import PharmacyDetailsScreen from './screens/PharmacyDetailsScreen';
import RouteScreen from './screens/RouteScreen';
import ReservationScreen from './screens/ReservationScreen';
import PaymentScreen from './screens/PaymentScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import ReservationsScreen from './screens/ReservationsScreen';
import EditProfileScreen from './screens/EditProfileScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const handleLogout = () => {
    // Logique de déconnexion (par exemple, retour à l'écran de connexion)
    props.navigation.navigate('Signin');
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label="Mon profil"
        icon={() => <Ionicons name="person" size={24} color="black" />}
        onPress={() => props.navigation.navigate('UserProfile')}
      />
      <DrawerItem
        label="Modifier mon profil"
        icon={() => <Ionicons name="person" size={24} color="black" />}
        onPress={() => props.navigation.navigate('EditProfile')}
      />
      <DrawerItem
        label="Mes réservations"
        icon={() => <Ionicons name="clipboard" size={24} color="black" />}
        onPress={() => props.navigation.navigate('Reservations')}
      />
      <DrawerItem
        label="Welcome"
        icon={() => <Ionicons name="clipboard" size={24} color="black" />}
        onPress={() => props.navigation.navigate('Welcome')}
      />
      <DrawerItem
        label="Déconnexion"
        icon={() => <Ionicons name="log-out" size={24} color="black" />}
        onPress={handleLogout}
      />
    </DrawerContentScrollView>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Welcome" component={WelcomeScreen} />
      <Drawer.Screen name="UserProfile" component={UserProfileScreen} />
      <Drawer.Screen name="Reservations" component={ReservationsScreen} />
    </Drawer.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Signin" component={SigninScreen} />
        <Stack.Screen name="Welcome" component={DrawerNavigator} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="PharmacyDetails" component={PharmacyDetailsScreen} />
        <Stack.Screen name="Route" component={RouteScreen} />
        <Stack.Screen name="Reservation" component={ReservationScreen} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
        <Stack.Screen name="Reservations" component={ReservationsScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
