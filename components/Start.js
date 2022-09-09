import { Text, View, Pressable } from 'react-native';
import { useContext} from 'react';
import styles from "../Style.js"
import {authContext} from "./Navigator.js"

export default function Start({navigation}){
  const {isAuth, setIsAuth} = useContext(authContext);
    return (
    <View style={styles.container}>
      <Text style = {{textAlign:"center", fontSize:40 }}> Choose method </Text>
      <View>
        <Pressable >
          <Text style = {styles.pressButton}>Use camera</Text>
        </Pressable>
        <Pressable>
          <Text style = {styles.pressButton}>Import picture</Text>
        </Pressable>
        <Pressable onPress={() => {setIsAuth(false)}}>
          <Text style = {styles.pressButton}>Logout</Text>
        </Pressable>
        
      </View>
    </View>)
}





