import { StatusBar } from 'expo-status-bar';
import { Component } from 'react';
import { StyleSheet, Text, View, Button, Alert, TextInput } from 'react-native';
import styles from "../Style.js"

export default class Login extends Component{
  render() {
    return (
    <View>
      <Text style = {{textAlign:"center", fontSize:40 }}> Login </Text>
      <View>
        <TextInput 
          placeholder="Email" 
          style={styles.input}
          />
          
        <TextInput
          style={styles.input}
          secureTextEntry={true}
          placeholder="Password"
        />
        <Button
          onPress={() => Alert.alert("Login !")}
          title="Login"
          accessibilityLabel="Connect button"
        />
        
      </View>
    </View>)
  }
}





