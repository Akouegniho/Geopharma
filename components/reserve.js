import React, { useState } from 'react';
import { View, Button, TextInput, StyleSheet } from 'react-native';

const SigninScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignin = () => {
    // Ajoutez votre logique de connexion ici
    if (!email || !password) {
      alert('Veuillez entrer votre email et mot de passe.');
      return;
    }
    // Pour les besoins de la démonstration, naviguer vers 'Welcome'
    navigation.navigate('Welcome');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <Button title="Se connecter" onPress={handleSignin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  input: {
    height: 40,
    width: '100%',
    marginBottom: 10,
    paddingHorizontal: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default SigninScreen;
<Picker
selectedValue={pays}
style={styles.input}
onValueChange={(itemValue, itemIndex) => setPays(itemValue)}
>
<Picker.Item label="Sélectionnez un pays" value="" />
<Picker.Item label="France" value="France" />
<Picker.Item label="États-Unis" value="USA" />
<Picker.Item label="Canada" value="Canada" />
{/* Ajoutez d'autres pays ici */}
</Picker>