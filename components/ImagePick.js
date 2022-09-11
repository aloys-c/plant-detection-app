import { Text, View, Pressable } from 'react-native';
import { Component} from 'react';
import styles from "../Style.js"
import {authContext} from "./global"
import * as ImagePicker from 'expo-image-picker';
import SwitchSelector from "react-native-switch-selector";
import { process_image } from './processing.js';







export default class ImagePick extends Component{

constructor(props){
  super(props)

  this.state = {
    organ: "flower",
  }
 }

  static contextType = authContext
    
  async importPicture(){
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!result.cancelled) {
      this.props.startProcessing()
      process_image({uri:result.uri,organ:this.state.organ},this.props.navigation).then((data)=>{
        this.props.stopProcessing()
        console.log(data)
        if(data)
          this.props.navigation.navigate("Edit",{data:data,uri:result.uri})
      })
      
    }
  };

  async takePicture(){
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
  
    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your camera!");
      return;
    }
  
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes:ImagePicker.MediaTypeOptions.Images,
      allowsEditing:true,
      aspect: [1, 1],
      quality:1,
    });
  
  
    if (!result.cancelled) {
      
      process_image({uri:result.uri, organ:this.state.organ},this.props.navigation)
    }
  
  }
  
  render(){
  return (
    <View>
      <View>
      <SwitchSelector style = {{width:240,borderWidth:1,borderColor:"green",borderRadius:10,}}
      options={[
        { label: "Flower", value: "flower", testID: "flower", accessibilityLabel: "Flower" },
        { label: "Leaf", value: "leaf", testID: "leaf", accessibilityLabel: "Leaf" },]}
      initial={0}
      buttonColor={"green"}
  borderColor={"green"}
  borderRadius ={10}
  bold = {true}
  width = {30}
      onPress={value => this.state.organ = value}
/>
      <Pressable onPress={() =>{this.takePicture()}}>
          <Text style = {styles.pressButton}>Take picture</Text>
        </Pressable>
        <Text style = {{textAlign:"center", fontSize:20,marginTop:8,marginBottom:-2, }}> or</Text>
        <Pressable onPress={() =>{this.importPicture()}}>
          <Text style = {styles.pressButton}>Import picture</Text>
        </Pressable>
        
        <Pressable onPress={() => {this.context.setIsAuth(false)}}>
          <Text style = {[styles.pressButton,{marginTop:80,backgroundColor:"darkred"}]}>Logout</Text>
        </Pressable>
        
      </View>
    </View>)}
}





