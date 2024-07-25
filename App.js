import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screens/HomeScreen';
import SignupScreen from './screens/SignupScreen';
import SigninScreen from './screens/SigninScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import SearchScreen from './screens/SearchScreen';
import PharmacyDetailsScreen from './screens/PharmacyDetailsScreen';
import RouteScreen from './screens/RouteScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Signin" component={SigninScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="PharmacyDetails" component={PharmacyDetailsScreen} />
        <Stack.Screen name="Route" component={RouteScreen} />
        <Stack.Screen name="Payment" component={PaymentMethodScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
