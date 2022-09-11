import { Text, View, Image, Pressable,TextInput, ActivityIndicator,ScrollView} from 'react-native';
import{Component} from 'react'
import { authContext } from './global.js';
import styles from "../Style.js"
import HideKeyboard from "./HideKeyboard.js"
import {uriToBlob, uploadToFirebase, getImageURL, detectPlant, getCurrentLocation, writeToFirebase,randomStr} from "./processing.js"
import Toast from 'react-native-toast-message';

export default class Edit extends Component{
  constructor(props) {
    super(props);
      this.state = {
        status :true,
        data:this.props.route.params.data,
        uri :this.props.route.params.uri,
        file:"test.jpg"
      }
     

     this.state.file = randomStr(16)+".jpg"
}
  
static contextType = authContext;



savePlant(){
  let doc = {...this.state.data,...{picturePath:this.state.file,maker:this.context.isAuth}}
  writeToFirebase("plants",doc).then(()=>{
    Toast.show({
      type: 'success',
      text1: "Plant successfully saved !",
      visibilityTime:2000,
    });
    this.props.navigation.navigate("Home")
  }).catch(e=>{Toast.show({
    type: 'error',
    text1: "Error...",
    visibilityTime:2000,
  });})

}

    render(){

        
    if(this.state.status){
    return (
      <HideKeyboard>
        <ScrollView>
      <View style={styles.container}> 
      <Image style = {{width: 240, height: 240}} source={{ uri:this.state.uri}}/>
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
          <Text style = {styles.pressButton}>Confirm</Text>
        </Pressable>
  </View>
  </ScrollView>
  </HideKeyboard>
      
    )
    }
    else{
      return(
      <View style={styles.container}>
          <ActivityIndicator size="large" color="green" />
          
      </View>
      )
    }
  }

    
}





