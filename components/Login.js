import { useContext,useState, Component} from 'react';
import { Text, View, Pressable, TextInput} from 'react-native';
import styles from "../Style.js"
import {authContext} from "./global.js"
import HideKeyboard from "./HideKeyboard.js"
import { readFromFirebase,updateObject } from './processing.js';
import Toast from 'react-native-toast-message';




export default class Login extends Component{


 
    state = {
      email: "",
      password:""
    }

    static contextType = authContext;

    checkLogin(){
      let exist = false;
      readFromFirebase("users").then((users)=>{
        
          users.forEach((doc) => {
          if(doc.data().email === this.state.email)
            {
              
              exist = true;
              console.log(exist)
              if(doc.data().password === this.state.password)
              {
                Toast.show({
                  type: 'success',
                  text1: "Welcome back !",
                  visibilityTime:2000,

                });
                this.context.setIsAuth(doc.id);
                return
              }
              else
              {
              
                Toast.show({
                  type: 'error',
                  text1: "Wrong password...",
                  visibilityTime:2000,
                });
                return
              }
            }
          });
          if(!exist)
          {
            console.log(exist)
            Toast.show({
              type: 'error',
              text1: "User doesn't exist...",
              visibilityTime:2000,
            });
          }
      });
      
        
    }

  
render(){
    return (
      <HideKeyboard>
        <View style={styles.container}>
      <Text style = {{textAlign:"center", fontSize:40,marginBottom:50,marginTop:-30 }}> Login </Text>
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
          onPress={() => this.checkLogin()}
          accessibilityLabel="Connect button"
        >
          <Text style = {styles.pressButton}>Login</Text>
          </Pressable>
          <Text style = {{color:"green",textAlign:"center", marginTop:30,margin:"auto"}}onPress = {() => this.props.navigation.navigate('Register')}>Don't have an account ? Register !</Text>
          
      </View>
      </View>



      </HideKeyboard>
    )
    }
}





