import {NavigationContainer} from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Component} from 'react';
import { Button, Pressable, Alert, Text } from "react-native";
import { authContext} from "./global.js";
import Login from "./Login.js";
import Register from "./Register.js"
import Home from "./Home.js";
import Edit from "./Edit.js";
import Toast from 'react-native-toast-message';

const Stack = createNativeStackNavigator();


export default class Navigator extends Component{
    
        constructor(){
          super()
          this.state = {
            isAuth: "user0"
          };
        }
       
   

    setIsAuth = (auth) => {
        this.setState({isAuth:auth})
      }

    render() {
        const { isAuth } = this.state
        const { setIsAuth } = this
      
  return(
    <authContext.Provider value={{isAuth,setIsAuth}}>
      <NavigationContainer>
        <Stack.Navigator>

            {this.state.isAuth ? (
            <>
                <Stack.Screen name="Home" component={Home} options={{title:"",headerStyle: {
            backgroundColor: '#009432',
          },headerTintColor: '#fff'}} />
                <Stack.Screen name="Edit" component={Edit} options={{title:"",headerStyle: {
            backgroundColor: '#009432',
          },headerTintColor: '#fff'}} />
            </>
            ) : (
            <>  
                <Stack.Screen name="Login" component={Login} options={{animationTypeForReplace: 'pop',title:"",headerStyle: {
            backgroundColor: '#009432',
          },headerTintColor: '#fff'}}/>
                <Stack.Screen name="Register" component={Register} options={{animationTypeForReplace: 'pop',title:"",headerStyle: {
            backgroundColor: '#009432',
          },headerTintColor: '#fff'}}/>
            </>
            )
            }

            
            
        </Stack.Navigator>
      </NavigationContainer>
      <>
      <Toast />
       </>
      </authContext.Provider>
      
  );
  
    }
}