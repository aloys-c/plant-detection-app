import { Text, View, Pressable,TextInput,ScrollView} from 'react-native';
import{Component} from 'react'
import { authContext } from '../global.js';
import * as constants from "../global.js"
import styles from "../Style.js"
import HideKeyboard from "./HideKeyboard.js"
import {updateInFirebase, writeToFirebase,randomStr, uploadToFirebase,deleteFileInFirebase,deleteInFirebase, compress_image} from "./processing.js"
import Toast from 'react-native-toast-message';
import ImageLoader from './ImageLoader.js';


export default class Edit extends Component{
  constructor(props) {
    super(props);
      this.state = {
        mode :this.props.route.params.mode,
        data:this.props.route.params.data,
        location :this.props.route.params.location,
      }
}
  
static contextType = authContext;



async savePlant(){

  if(this.state.mode =="new"){
    file = randomStr(16)+".jpg"
    let doc = {...this.state.data,...{picturePath:file,maker:this.context.isAuth}}

    Promise.all([writeToFirebase("plants",doc),uploadToFirebase(this.state.location.uri,file)]).then((res)=>{
    if(res){
      Toast.show({
        type: 'success',
        text1: "Plant saved !",
        visibilityTime:2000,
      });
      this.props.navigation.navigate("Home")
    }
    else{
        Toast.show({
      type: 'error',
      text1: "Error...",
      visibilityTime:2000,
      })
    }
    });
  }
  
  else {

  let doc = this.state.data
  let id = this.state.location.id
  updateInFirebase("plants",id,doc).then((res)=>{
    if(res)
    { 
    Toast.show({
      type: 'success',
      text1: "Plant updated !",
      visibilityTime:2000,
    });
    this.props.navigation.navigate("Home")
  }
    else{
      Toast.show({
        type: 'error',
        text1: "Error...",
        visibilityTime:2000,
      })
    }
  

  })
  }
}


  deletePlant(){
    Promise.all([deleteInFirebase("plants",this.state.location.id),deleteFileInFirebase(this.state.data.picturePath)]).then((res)=>{
      if(res){
        Toast.show({
          type: 'success',
          text1: "Plant deleted !",
          visibilityTime:2000,
        });
        this.props.navigation.navigate("Home")
      }
      else{
          Toast.show({
        type: 'error',
        text1: "Error...",
        visibilityTime:2000,
        })
      }
      });
  }

    render(){

    return (
      <HideKeyboard>
        <ScrollView>
      <View style={styles.container}> 
      <ImageLoader style = {{width: 240, height: 240}} source={{ uri:this.state.location.uri}}/>
      <TextInput 
          placeholder="Name"  
          defaultValue={this.state.data.name}
          onChangeText={text => {this.state.data.name= text}}
          style={styles.input}
          />
      
      <TextInput 
      placeholder="Score"  
      keyboardType='numeric'
      defaultValue={String(this.state.data.score)}
      onChangeText={text => {this.state.data.score = text}}
      style={styles.input}
      />
      <TextInput 
      placeholder="North"  
      keyboardType='numeric'
      defaultValue={String(this.state.data.lat)}
      onChangeText={text => {this.state.data.lat = text}}
      style={styles.input}
      />
      <TextInput 
      placeholder="East"  
      keyboardType='numeric'
      defaultValue={String(this.state.data.lon)}
      onChangeText={text => {this.state.data.lon = text}}
      style={styles.input}
      />
      <TextInput 
      placeholder="Country" 
      defaultValue={this.state.data.country}
      onChangeText={text => {this.state.data.country = text}}
      style={styles.input}
      />
      <TextInput 
      placeholder="City"  
      defaultValue={this.state.data.city}
      onChangeText={text => {this.state.data.city = text}}
      style={styles.input}
      />
      <TextInput 
      placeholder="Place"  
      defaultValue={this.state.data.street}
      onChangeText={text => {this.state.data.street = text}}
      style={styles.input}
      />
      <Pressable onPress={() => {this.savePlant()}}>
          <Text style = {styles.pressButton}>Save</Text>
        </Pressable>
        {this.props.route.params.mode == "edit" &&
        <Pressable onPress={() => {this.deletePlant()}}>
          <Text style = {[styles.pressButton,{backgroundColor:constants.RED}]}>Delete</Text>
        </Pressable>}
  </View>
  </ScrollView>
  </HideKeyboard>
      
    )
  }
}





