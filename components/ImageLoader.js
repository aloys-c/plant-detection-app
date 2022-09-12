import { Component } from "react";
import { Image,ActivityIndicator, View} from "react-native";


export default class ImageLoader extends Component{

    constructor(props){
        super(props)

        this.state={
            loaded:false,
        }
    }
    

    render(){
        return(
            <View>
            <Image
                
                style = {[this.props.style,{display:!this.state.loaded ? "hidden":"block"}]}
                source = {this.props.source}
                onLoad = {()=>{this.setState({"loaded":true})}}
            />
           {!this.state.loaded && <View style ={[this.props.style,{position:"absolute",alignContent:"center",alignContent:"center",justifyContent:"center",backgroundColor:"lightgrey"}]}>
                <ActivityIndicator/>
                </View>}
            
            </View>
           
        )


    }

}