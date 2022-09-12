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
            user_data: [],
            modal_open:false,
            cog:false,
            render:false,
          }

        this.props.navigation.setOptions({headerRight: () => (
            <Pressable
            style = {{width:20,height:20,alignItems:"center",justifyContent:"center"}}
              onPress={() => {this.updateState("modal_open",true);
              this.props.navigation.setOptions({headerRight:null,});}}
              
            >
              <Text style = {{color:"white",fontSize:20,fontWeight:"bold"}}>+</Text>
            </Pressable>
          )})
    }
    

    async componentDidMount() {
        const user_data = await this.getUserData();
        this.setState({user_data});
      }

    updateState(key,value){
        sub_obj={}
        sub_obj[key] = value
        this.setState({...this.state,...sub_obj})
      
    }

    async getUserData(){
        
        user = this.context.isAuth;
        return readFromFirebase("plants").then(plants =>{
            userData = []
            plants.forEach(doc => {
                
                if(doc.data().maker == user)
                {
                    userData.push({data:doc.data(),location:{"id":doc.id}})
                }
            })
            
            urls = []
            for(i=0;i<userData.length;i++){
                urls.push(getImageURL(userData[i].data.picturePath))
            }
            return Promise.all(urls).then((urls) =>{
                for(i=0;i<userData.length;i++){
                    userData[i].location.uri = urls[i]
                }
                return userData
            })   
        })
    }  
    
 
    
        
   

    render(){
        if(!this.state.user_data){
           
        }
        else{ 
        return(
        <View style={styles.container}>
          {this.state.modal_open &&
            <View style={{backgroundColor:'rgba(0, 0, 0, 0.8)',width:Dimensions.get("screen").width,height:Dimensions.get("screen").height}}></View>
          }
          <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modal_open}
          
        >  
          
            <View style={{width:Dimensions.get('window').width-40,marginLeft:20,marginBottom:180,marginTop:100, backgroundColor:"white",borderColor:"green", borderWidth:1,borderRadius:5}}>
            <Pressable style={{justifyContent:"center",alignContent:"center", alignItems:"center", width:20,height:20,borderRadius:20,backgroundColor:"black",margin:10}}
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
        {true &&
        <FlatList
            numColumns={3}
          data={this.state.user_data}
          style ={styles.grid}
          showsVerticalScrollIndicator={true}
          renderItem={({item}) =>
          <View >
            <Pressable onPress={()=> this.props.navigation.navigate("Edit",{data:item.data,location:item.location,mode:"edit"})}>
            <Image
            
        style = {styles.gridImage}
        source={{
            uri: item.location.uri}} />
        
            </Pressable>
          </View>
          
          }
          keyExtractor={item => item.location.id}
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