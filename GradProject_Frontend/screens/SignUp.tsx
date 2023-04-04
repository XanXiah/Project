import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LoginPage from "./LoginPage";
import axios from 'axios';

const SignUp = () => {

  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateEmail = (email: string) => {
    // Email validation regex
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password: string) => {
    // Password validation regex
    // Must contain at least one lowercase letter, one uppercase letter, and one digit
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return re.test(password);
  };

  const handleSignUp = () => {
    let emailError = '';
    let passwordError = '';
    let confirmPasswordError = '';

    if (!validateEmail(email)) {
      emailError = 'Invalid email';
    }
    if (!validatePassword(password)) {
      passwordError = 'Invalid password';
    }
    if (password !== confirmPassword) {
      confirmPasswordError = 'Password mismatch';
    }

    setEmailError(emailError);
    setPasswordError(passwordError);
    setConfirmPasswordError(confirmPasswordError);

    if (!emailError && !passwordError && !confirmPasswordError) {
      const data = {'email' : email , 'password':password}
      axios.post('http:10.0.2.2:3000/users/signup',data)
      Alert.alert(
        'Sign up complete',
        '',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('LoginPage'),
          },
        ],
        { cancelable: false }
      );
    }
  };

  const handleEmailChange = (text: string) => {
    if (!validateEmail(text)) {
      setEmailError('Invalid email');
    } else {
      setEmailError('');
    }
    setEmail(text);
  };

  const handlePasswordChange = (text: string) => {
    if (!validatePassword(text)) {
      setPasswordError('Invalid password');
    } else {
      setPasswordError('');
    }
    setPassword(text);
  };

  const handleConfirmPasswordChange = (text: string) => {
    if (text !== password) {
      setConfirmPasswordError('Password mismatch');
    } else {
      setConfirmPasswordError('');
    }
    setConfirmPassword(text);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={handleEmailChange}
      />
      {emailError ? <Text style={styles.error}>{emailError}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={handlePasswordChange}
      />
      {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Confirm password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={handleConfirmPasswordChange}
      />
      {confirmPasswordError ? (
        <Text style={styles.error}>{confirmPasswordError}</Text>
      ) : null}
      <TouchableOpacity style={styles.button}>
        <Button
          title="Sign up"
          onPress={handleSignUp}
          disabled={emailError || passwordError || confirmPasswordError ? true : false}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    padding: 10,
  },
  error: {
    color: 'red',
  },
  button: {
    margin: 8
  }
});

export default SignUp;
