import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff', 
      alignItems: 'center',
      justifyContent: 'center',
    },
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
      width: 200,
    },
    pressButton: {
      fontWeight:"bold",
      height: 40,
      color:"white",
      backgroundColor : "green",
      margin: 12,
      borderWidth: 0,
      borderRadius:10,
      padding: 10,
      textColor:"white",
      width: 200,
      textAlign: 'center',
      overflow:"hidden",

    },
  });