import React,{Component} from 'react';
import { View , Image,Text,Modal,FlatList, Alert,Pressable,Dimensions,ActivityIndicator} from 'react-native';
import { authContext } from './global';
import CustomFastImage from './CustomFastImage';
import styles from "../Style.js"
import ImagePick from "./ImagePick.js"
import { getImageURL, readFromFirebase,randomStr} from "./processing.js"
import { useFocusEffect } from '@react-navigation/native';



export default class Home extends Component{

  static contextType = authContext;

    constructor(props){
        super(props)

        this.state = {
            data: [],
            modal_open:false,
            cog:false,
          }

        this.props.navigation.setOptions({title:"",headerRight: () => (
            <Pressable
            style = {{width:20,height:20,alignItems:"center",justifyContent:"center"}}
              onPress={() => {this.updateState("modal_open",true);
              this.props.navigation.setOptions({headerRight:null,});}}
              
            >
              <Text style = {{color:"white",fontSize:20,fontWeight:"bold"}}>+</Text>
            </Pressable>
          ),headerStyle: {
          backgroundColor: 'green',
        },headerTintColor: '#fff'})
    }
    
    toggleProcessing(state){
      if(state){
        
      }
    }

    /*async componentDidMount() {
        const data = await this.getUserData();
        this.setState({data});
      }*/

    updateState(key,value){
        sub_obj={}
        sub_obj[key] = value
        this.setState({...this.state,...sub_obj})
      
    }

    async getUserData(){
        
        user = this.context.isAuth;
        return readFromFirebase("plants").then(plants =>{
            temp = []
            plants.forEach(doc => {
                
                if(doc.data().maker == user)
                {
                    temp.push(doc.data())
                }
            })
            
            urls = []
            for(i=0;i<temp.length;i++){
                urls.push(getImageURL(temp[i].picturePath))
            }
            return Promise.all(urls).then((urls) =>{
                for(i=0;i<temp.length;i++){
                    temp[i].imURL = urls[i]
                }
                return temp
            })   
        })
    }  
    
 
    
        
   

    render(){
      
        if(!this.state.data){
           
        }
        else{ 
        return(
        <View style ={{marginTop:-30}}>
          {this.state.modal_open &&
            <View style={{backgroundColor:'rgba(0, 0, 0, 0.8)',width:Dimensions.get("screen").width,height:Dimensions.get("screen").height,marginTop:-30}}></View>
          }
          <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modal_open}
          
        >  
          
            <View style={{width:Dimensions.get('window').width-40,marginLeft:20,marginBottom:180,marginTop:100, backgroundColor:"white",borderColor:"green", borderWidth:2,borderRadius:20}}>
            <Pressable style={{justifyContent:"center",alignContent:"center", alignItems:"center", width:20,height:20,borderRadius:20,backgroundColor:"green",margin:10}}
                onPress={() => {this.updateState("modal_open",false)
                this.props.navigation.setOptions({headerRight
                : () => (
                        <Pressable
                        style = {{width:20,height:20,alignItems:"center",justifyContent:"center"}}
                          onPress={() => {this.updateState("modal_open",true);
                          this.props.navigation.setOptions({headerRight
                            : null})
                        }}
                        >
                          <Text style = {{color:"white",fontSize:20,fontWeight:"bold"}}>+</Text>
                        </Pressable>
                      ),})}}
              >
                <Text style={{color:"white",fontWeight:"bold"}}>x</Text>
              </Pressable>
            
            <View style = {{alignItems:"center", marginBottom:30, marginTop:0}}>
            
                <ImagePick stopProcessing = {()=>{this.updateState("cog",false)}} startProcessing = {() => {this.updateState("cog",true);this.updateState("modal_open",false)
                this.props.navigation.setOptions({headerRight
                : () => (
                        <Pressable
                        style = {{width:20,height:20,alignItems:"center",justifyContent:"center"}}
                          onPress={() => {this.updateState("modal_open",true);
                          this.props.navigation.setOptions({headerRight
                            : null})
                        }}
                        >
                          <Text style = {{color:"white",fontSize:20,fontWeight:"bold"}}>+</Text>
                        </Pressable>
                      ),})}} navigation={this.props.navigation}/>
            </View>
          </View>
           
        </Modal>
        {false &&
        <FlatList
            numColumns={3}
          data={this.state.data}
          style ={styles.grid}
          showsVerticalScrollIndicator={true}
          renderItem={({item}) =>
          <View >
            <Pressable onPress={()=> Alert.alert("pressed")}>
            <Image
            
        style = {styles.gridImage}
        source={{
            uri: item.imURL}} />
        
            </Pressable>
          </View>
          
          }
          keyExtractor={item => item.imagePath}
        />}
        {this.state.cog &&
        <View style={styles.container}>
        <View style={{width:100,height:100,backgroundColor:"'rgba(0, 0, 0, 0.8)'",justifyContent:"center",borderRadius:20,marginTop:400}}>
          <ActivityIndicator size="large" color="white" />
          
        </View>
        </View> }
        </View>
        
        )
    }
    }
    
}