import React from "react";
import { StyleSheet , View , Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginPage from "./screens/LoginPage";
import SignUp from "./screens/SignUp";
import HomePage from "./screens/HomePage";
import TokenPage from "./screens/TokenPage";
import ResetPassword from "./screens/ResetPassword";
const Stack = createNativeStackNavigator();

const StackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Group>
                <Stack.Screen name="LoginPage" component={LoginPage}/>
                <Stack.Screen name="SignUp" component={SignUp}/>
                <Stack.Screen name="ResetPassword" component={ResetPassword}/>
                <Stack.Screen name="TokenPage" component={TokenPage}/>
                <Stack.Screen name="HomePage" component={HomePage}/>
            </Stack.Group>
        </Stack.Navigator>
    );
}

export default StackNavigator;
