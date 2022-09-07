import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import Login from "./components/Login.js";
import styles from "./Style.js"

export default function App() {
  return (
    <View style={styles.container}>
      <Login/>
      
      <StatusBar style="auto" />
    </View>
  );
}




