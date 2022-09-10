import { useContext,useState, Component} from 'react';
import { Text, View, Pressable, TextInput} from 'react-native';
import styles from "../Style.js"
import {authContext} from "./global.js"
import HideKeyboard from "./HideKeyboard.js"
import { readFromFirebase,updateObject, writeToFirebase } from './processing.js';
import Toast from 'react-native-toast-message';



export default class Register extends Component{

    state = {
      email: "",
      password:""
    }

    static contextType = authContext;

    register(){
      let exist = false;
      readFromFirebase("users").then((users)=>{
        
          users.forEach((doc) => {
          if(doc.data().email === this.state.email)
            {
              exist = true;
              Toast.show({
                type: 'error',
                text1: "User already exist !",
                visibilityTime:2000,

              });
              return
            }
          });
          if(!exist)
          {
            writeToFirebase("users",this.state).then((userID)=>{
              Toast.show({
                type: success,
                text1: "Welcome !",
                visibilityTime:2000,

              });
              this.context.setIsAuth(userID);
                return
            })
            
          }
      });
      
        
    }


render(){
    return (
      <HideKeyboard>
        <View style={styles.container}>
      <Text style = {{textAlign:"center", fontSize:40,marginBottom:50,marginTop:-50 }}> Register </Text>
      <View>
        <TextInput 
          placeholder="Email"  
          style={styles.input}
          onChangeText ={text => this.state.email = text}
          />
          
        <TextInput
          style={styles.input}
          secureTextEntry={true}
          placeholder="Password"
          onChangeText ={text => this.state.password = text}
        />
        <Pressable
          onPress={() => this.register()}
          accessibilityLabel="Register button"
        >
          <Text style = {styles.pressButton}>Register</Text>
          </Pressable>
        
      </View>
      </View>



      </HideKeyboard>
    )
    }
}





