import { useContext} from 'react';
import { Text, View, Pressable, Alert, TextInput } from 'react-native';
import styles from "../Style.js"
import {authContext} from "./Navigator.js"

export default function Login({navigation}){
const {isAuth, setIsAuth} = useContext(authContext);

    return (
    <View style={styles.container}>
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
        <Pressable
          onPress={() => {setIsAuth(true)}}
          accessibilityLabel="Connect button"
        >
          <Text style = {styles.pressButton}>Login</Text>
          </Pressable>
        
      </View>
    </View>)

}





