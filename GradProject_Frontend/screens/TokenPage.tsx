import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios'
import { useRecoilState } from 'recoil';
import { userToken, userUID } from './recoilstate';
import { useNavigation } from '@react-navigation/native';

const TokenPage = () => {
  const navigation = useNavigation();
  const [text, setText] = useState('');
  const [usertoken , setusertoken] = useRecoilState(userToken);
  const [uid , setuid] = useRecoilState(userUID)
  const handleConfirm = () => {
    console.log("uid in tokenpage",uid);
    
    console.log('token -> ' ,text); // Do whatever you want with the text value here
    setusertoken(text);
    const data = {'uid': uid , 'token':usertoken}
    axios.post('http:10.0.2.2:3000/users/setUserToken',data)
    navigation.navigate('HomePage');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Enter text here"
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
