import { Text, View, Image, Pressable,TextInput, ActivityIndicator,ScrollView} from 'react-native';
import{Component} from 'react'
import { authContext } from './global.js';
import styles from "../Style.js"
import HideKeyboard from "./HideKeyboard.js"
import {uriToBlob, uploadToFirebase, getImageURL, detectPlant, getCurrentLocation, writeToFirebase,randomStr} from "./processing.js"
import Toast from 'react-native-toast-message';

export default class Result extends Component{
  constructor(props) {
    super(props);
      this.state = {
        status :false,
        geoData:{},
        plantData:{},
      }
}
  
static contextType = authContext;

  uri = this.props.route.params.imageURI
  file = randomStr(16)+".jpg";
  organ = this.props.route.params.organ
  

  
    
  async store_image_url(uri,file,organ){
    return uriToBlob(uri).then(blob => {
      return uploadToFirebase(blob,file).then(()=>{
        return getImageURL(file).then((imURL)=>{
          return detectPlant(imURL,organ).then((res)=>{return res});
        });
      });
    });
  }

  savePlant(){
    let doc = {...this.state.geoData,...this.state.plantData,...{picturePath:this.file,maker:this.context.isAuth}}
    writeToFirebase("plants",doc).then(()=>{
      Toast.show({
        type: 'success',
        text1: "Plant successfully saved !",
        visibilityTime:2000,
      });
      this.props.navigation.navigate("Start")
    }).catch(e=>{Toast.show({
      type: 'error',
      text1: "Error...",
      visibilityTime:2000,
    });})

  }
 //let body = new FormData();
  
  //body.append('organs', 'flower');
  

  //let uri = route.params.imageURI.slice(0,-3)+"jpeg"
  //FileSystem.moveAsync({from:route.params.imageURI,to:uri})

  //body.append('images', {uri: uri.replace('file://', ''),type: 'image/jpeg'});
  //console.log(body)
  /*fetch(Url,{ method: 'POST',headers:{  
       "Content-Type": "multipart/form-data",
       } , body :body} )
    .then((res) => res.json())
    .then((res) => { console.log("response" +JSON.stringify(res)); })
    .catch((e) => console.log(e))*/
      render(){

        if(!this.state.status)
        {
          Promise.all([this.store_image_url(this.uri,this.file,this.organ),getCurrentLocation()]).then((res)=>{
          if(!res[0].error)
            this.setState({status:true,plantData:res[0].result,geoData:res[1].result})
          else
          {
            Toast.show({
              type: 'error',
              text1: res[0].error,
              visibilityTime:2000,
            });
            this.props.navigation.navigate('Start')
          }
      
          })
        }
    if(this.state.status){
    return (
      <HideKeyboard>
        <ScrollView>
      <View style={styles.container}> 
      <Image style = {{width: 240, height: 240}} source={{ uri: this.uri}}/>
      <TextInput 
          placeholder="Name"  
          defaultValue={this.state.plantData.name}
          onChangeText={text => {this.state.plantData.name= text}}
          style={styles.input}
          />
      
      <TextInput 
      placeholder="Score"  
      keyboardType='numeric'
      defaultValue={String(this.state.plantData.score)}
      onChangeText={text => {this.state.plantData.score = text}}
      style={styles.input}
      />
      <TextInput 
      placeholder="North"  
      keyboardType='numeric'
      defaultValue={String(this.state.geoData.lat)}
      onChangeText={text => {this.state.geoData.lat = text}}
      style={styles.input}
      />
      <TextInput 
      placeholder="East"  
      keyboardType='numeric'
      defaultValue={String(this.state.geoData.lon)}
      onChangeText={text => {this.state.geoData.lon = text}}
      style={styles.input}
      />
      <TextInput 
      placeholder="Country" 
      defaultValue={this.state.geoData.country}
      onChangeText={text => {this.state.geoData.country = text}}
      style={styles.input}
      />
      <TextInput 
      placeholder="City"  
      defaultValue={this.state.geoData.city}
      onChangeText={text => {this.state.geoData.city = text}}
      style={styles.input}
      />
      <TextInput 
      placeholder="Place"  
      defaultValue={this.state.geoData.street}
      onChangeText={text => {this.state.geoData.street = text}}
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





