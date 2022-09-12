import {Text, View, Pressable} from 'react-native';
import {Component} from 'react';
import styles from "../Style.js"
import {authContext} from "../global"
import * as ImagePicker from 'expo-image-picker';
import SwitchSelector from "react-native-switch-selector";
import {compress_image, process_image} from './processing.js';
import * as constants from "../global.js"


export default class ImagePick extends Component {

    constructor(props) {
        super(props)

        this.state = {
            organ: "flower"
        }
    }

    static contextType = authContext;
    async importPicture() {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [
                1, 1
            ],
            quality: 1
        });

        if (! result.cancelled) {
            this.props.startProcessing()
            process_image({
                uri: result.uri,
                organ: this.state.organ
            }, this.props.navigation).then((data) => {
                this.props.stopProcessing()
                compress_image(result.uri, constants.IMAGE_SIZE, constants.COMPRESSION_FACTOR).then((res) => {
                    if (data) 
                        this.props.navigation.navigate("Edit", {
                            data: data,
                            location: {
                                uri: res.uri
                            },
                            mode: "new"
                        })


                })

            })

        }
    };

    async takePicture() { // Ask the user for the permission to access the camera
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("You've refused to allow this app to access your camera!");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [
                1, 1
            ],
            quality: 1
        });


        if (! result.cancelled) {
            this.props.startProcessing()
            process_image({
                uri: result.uri,
                organ: this.state.organ
            }, this.props.navigation).then((data) => {
                this.props.stopProcessing()
                if (data) 
                    this.props.navigation.navigate("Edit", {
                        data: data,
                        location: {
                            uri: result.uri
                        },
                        mode: "new"
                    })


                


            })

        }

    }

    render() {
        return (
            <View>
                <View>
                    <SwitchSelector style={
                            {
                                width: 240,
                                borderWidth: 1,
                                borderColor: constants.GREEN,
                                borderRadius: 5
                            }
                        }
                        options={
                            [
                                {
                                    label: "Flower",
                                    value: "flower",
                                    testID: "flower",
                                    accessibilityLabel: "Flower"
                                }, {
                                    label: "Leaf",
                                    value: "leaf",
                                    testID: "leaf",
                                    accessibilityLabel: "Leaf"
                                },
                            ]
                        }
                        initial={0}
                        buttonColor={constants.GREEN}
                        borderColor={constants.GREEN}
                        borderRadius
                        ={5}
                        bold={true}
                        width={30}
                        onPress={
                            value => this.state.organ = value
                        }/>
                    <Pressable onPress={
                        () => {
                            this.takePicture()
                        }
                    }>
                        <Text style={
                            styles.pressButton
                        }>Take picture</Text>
                    </Pressable>
                    <Text style={
                        {
                            textAlign: "center",
                            fontSize: 20,
                            marginTop: 8,
                            marginBottom: -2
                        }
                    }>
                        or</Text>
                    <Pressable onPress={
                        () => {
                            this.importPicture()
                        }
                    }>
                        <Text style={
                            styles.pressButton
                        }>Import picture</Text>
                    </Pressable>

                    <Pressable onPress={
                        () => {
                            this.context.setIsAuth(false)
                        }
                    }>
                        <Text style={
                            [
                                styles.pressButton, {
                                    marginTop: 80,
                                    backgroundColor: constants.RED
                                }
                            ]
                        }>Logout</Text>
                    </Pressable>

                </View>
            </View>
        )
    }
}
