import {StyleSheet, Dimensions} from 'react-native';
import * as constants from "./global.js"

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: "center",
        paddingBottom: 20,
        paddingTop: 20
    },
    input: {
        display: "block",
        height: 40,
        margin: "auto",
        marginTop: 10,
        width: 240,
        borderWidth: 1,
        padding: 10

    },
    pressButton: {
        fontWeight: "bold",
        height: 40,
        color: "white",
        backgroundColor: constants.GREEN,
        marginTop: 15,
        borderWidth: 0,
        borderRadius: 5,
        width: Dimensions.get('window').width * 0.65,
        padding: 10,
        textColor: "white",
        textAlign: 'center',
        overflow: "hidden"
    },
    gridImage: {
        width: Dimensions.get("window").width / 3,
        height: Dimensions.get("window").width / 3
    },
    grid: {
        width: Dimensions.get("window").width,
        marginTop: -30
    }
});
