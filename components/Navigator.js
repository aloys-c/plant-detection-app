import {NavigationContainer} from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Component,createContext } from 'react';
import { Alert } from "react-native";
import Login from "./Login.js";
import Start from "./Start.js";

const Stack = createNativeStackNavigator();
export const authContext = createContext();

export default class Navigator extends Component{
    
        constructor(){
          super()
          this.state = {
            isAuth: false
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
                <Stack.Screen name="Start" component={Start} />
            </>
            ) : (
            <>  
                <Stack.Screen name="Login" component={Login}/>
            </>
            )
            }

            
            
        </Stack.Navigator>
      </NavigationContainer>
      </authContext.Provider>
  );
  
    }
}