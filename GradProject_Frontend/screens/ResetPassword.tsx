import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios'
import { useRecoilState } from 'recoil';
import { userToken, userUID } from './recoilstate';
import { useNavigation } from '@react-navigation/native';

const TokenPage = () => {
  const navigation = useNavigation();
  const [text, setText] = useState('');
  const [email , setemail] = useState('');
  const [uid , setuid] = useRecoilState(userUID)
  const handleConfirm = () => {
    console.log('password -> ' ,text); // Do whatever you want with the text value here
    const data = {'email':text}
    console.log(data);
    axios.post('http:10.0.2.2:3000/users/reset-password',data)
    showAlert();
    navigation.navigate('LoginPage');
  };

  
  const showAlert = () => {
    Alert.alert(
        "Check your email"
    )
}

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Enter your email"
      />
      <Button
        title="Confirm"
        onPress={handleConfirm}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    width: '100%',
    borderWidth: 1,
    borderColor: 'gray',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

export default TokenPage;
