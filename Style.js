import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff', 
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom:20,
      paddingTop:20,
    },
    input: {
      display:"block",
      height: 40,
      margin: "auto",
      marginTop:10,
      width:240,
      borderWidth: 1,
      padding: 10,
      
    },
    pressButton: {
      fontWeight:"bold",
      height: 40,
      color:"white",
      backgroundColor : "green",
      margin:"auto",
      marginTop:15,
      borderWidth: 0,
      borderRadius:10,
      width:240,
      padding: 10,
      textColor:"white",
      textAlign: 'center',
      overflow:"hidden",
    },
  });