import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { RecoilState, useRecoilState } from 'recoil';
import { userToken, userUID } from './recoilstate';

const LoginPage = () => {

  const navigation = useNavigation();
  const [utoken, setutoken] = useRecoilState(userToken);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [uid , setuid] = useRecoilState(userUID);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  };

  const handleForgotPasswordPress = () => {
    console.log('Forgot password button pressed');
    navigation.navigate('ResetPassword');
  };

  const handleSignInPress = () => {
    if (username.trim() === '' && password.trim() !== '') {
      Alert.alert('Error', 'Username are required');
      return;
    }
    else if (username.trim() !== '' && password.trim() === '') {
      Alert.alert('Error', 'Password are required');
      return;
    }
    else if (username.trim() === '' && password.trim() === '') {
      Alert.alert('Error', 'Username and password are required');
      return;
    }
    else if (!isValidEmail(username)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address', [{ text: 'OK' }]);
      return;
    } else {
      console.log("come to this");
      
      const data = { 'email': username, 'password': password }
      axios.post('http://10.0.2.2:3000/users/login', data)
        .then((response:any) => {
          console.log('come in this');
          
          if (response.data.user != 'Invalid') {
            console.log(response.data.user);
            setuid(response.data.user)
            console.log(uid);
            const useruid = {'uid': response.data.user}
            console.log(useruid);
            axios.post('http://10.0.2.2:3000/users/getUserToken', useruid)
              .then((res: any) => {
                console.log("res ->" , res.data);
                if (res.data != 'Invalid') {
                  setutoken(res.data)
                  navigation.navigate('HomePage');
                } else {
                  navigation.navigate('TokenPage')
                }
              })
          } else {
            Alert.alert('Invalid Email or password');
          }
        });
    }
  };

  return (
    <View>
      {/* <Text>Username:</Text> */}
      <TextInput
        placeholder="Email"
        style={styles.inputBox}
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      {/* <Text>Password:</Text> */}
      <TextInput
        placeholder="Password"
        secureTextEntry={true}
        style={styles.inputBox}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <View>
        <View style={styles.signUpButtonContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text>Sign up</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.forgotPasswordButtonContainer}>
          <TouchableOpacity onPress={handleForgotPasswordPress}>
            <Text>Forgot password</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* <TouchableOpacity onPress={() => console.log('Login with Gmail button pressed')}>
        <View style={styles.loginWithGmail}>
          <Text>Login with</Text>
          <Image source={require('./assets/gmail-icon.png')}
            style={{ width: 30, height: 30, margin: 5, resizeMode: 'contain' }} />
        </View>
      </TouchableOpacity> */}
      <TouchableOpacity style={styles.signInButton} onPress={handleSignInPress}>
        <Text style={styles.signInButton}>Sign in</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({

  inputBox: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 8,
    margin: 8
  },
  signUpButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    margin: 8
  },
  forgotPasswordButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  loginWithGmail: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  signInButton: {
    backgroundColor: '#199bec',
    color: '#ffffff',
    borderRadius: 4,
    padding: 4,
    margin: 4,
    alignItems: 'center'
  }
});

export default LoginPage;
