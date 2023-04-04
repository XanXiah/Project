import React from "react";
import { View, Text, SafeAreaView, Button } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";
const Setting = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView>
            <View>
                <View style={styles.homebutton}>
                    <Button onPress={() => navigation.navigate("LoginPage")} title="LOGOUT" color="red"/>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Setting;

const styles = StyleSheet.create({
    homebutton: {
        padding: 5,
        display: "flex",
    },
})
