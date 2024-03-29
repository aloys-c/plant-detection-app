import * as Location from 'expo-location'
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytes,
    deleteObject
} from "firebase/storage";
import {
    collection,
    addDoc,
    updateDoc,
    getFirestore,
    getDocs,
    doc,
    deleteDoc
} from "firebase/firestore";
import * as FileSystem from 'expo-file-system'
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {manipulateAsync} from 'expo-image-manipulator';


export const uriToBlob = (uri) => {

    return new Promise((resolve, reject) => {

        const xhr = new XMLHttpRequest();

        xhr.onload = function () { // return the blob
            resolve(xhr.response);
        };

        xhr.onerror = function () { // something went wrong
            reject(new Error('uriToBlob failed'));
        };

        // this helps us get a blob
        xhr.responseType = 'blob';

        xhr.open('GET', uri, true);
        xhr.send(null);

    });

}

export const uploadToFirebase = (uri, file) => {

    return uriToBlob(uri).then((blob) => {

        return new Promise((resolve, reject) => {
            const storage = getStorage();
            var storageRef = ref(storage, file);

            uploadBytes(storageRef, blob).then((snapshot) => {

                blob.close();

                resolve(snapshot);

            }).catch((error) => {

                reject(error);

            });

        });
    })
}

export async function compress_image(uri, size, factor) {
    const result = await manipulateAsync(uri, [
        {
            resize: {
                height: size
            }
        }
    ], {compress: factor})

    return result;
}

export async function writeToFirebase(coll, doc) {
    const db = getFirestore();

    try {
        const docRef = await addDoc(collection(db, coll), doc);
        console.log("Document written with ID: ", docRef.id);
        return docRef.id
    } catch (e) {
        console.error("Error adding document: ", e);
        return 0
    }
}


export async function updateInFirebase(coll, id, document) {
    const db = getFirestore();

    try {
        return updateDoc(doc(db, coll, id), document).then(() => {
            console.log("Document updated !");
            return true
        });
    } catch (e) {
        console.error("Error updating document: ", e);
        return 0
    }
}

export async function deleteInFirebase(coll, id) {
    const db = getFirestore();
    await deleteDoc(doc(db, coll, id));
}

export async function deleteFileInFirebase(file) {
    storage = getStorage()

    const fileRef = ref(storage, file);

    deleteObject(fileRef).then(() => {
        return 1;
    }).catch((error) => {
        return 0;
    });
}

export const storeData = async (value) => {
    try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem('@storage_Key', jsonValue)
    } catch (e) {
        console.log(e)
        return 0
    }
}

export const getData = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('@storage_Key')
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        return 0
    }
}

export function updateObject(obj, key, value) {
    obj.key = value
    return obj
}

export const randomStr = (length = 8) => { // Declare all characters
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    // Pick characers randomly
    let str = '';
    for (let i = 0; i < length; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return str;

};

export async function readFromFirebase(coll) {
    const db = getFirestore();
    const querySnapshot = await getDocs(collection(db, coll));
    return querySnapshot;
}


export function getImageURL(file) {
    const storage = getStorage();
    const storageRef = ref(storage, file);
    return getDownloadURL(storageRef)
}


const getCurrentLocation = async () => {
    let {status} = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
        Alert.alert('Permission not granted', 'Allow the app to use location service.', [
            {
                text: 'OK'
            }
        ], {cancelable: false});
    }

    let {coords} = await Location.getCurrentPositionAsync();

    if (coords) {
        const {latitude, longitude} = coords;
        let response = await Location.reverseGeocodeAsync({latitude, longitude});
        return Promise.resolve(response).then(response => {
            response = response[0]
            console.log("GeoData retrieved.")
            return {
                error: false,
                result: {
                    city: response.city,
                    country: response.country,
                    street: response.street,
                    lat: latitude,
                    lon: longitude
                }
            }
        })

    }
}


async function detectPlantLocal(image) {
    let body = new FormData();
    let Url = 'https://my-api.plantnet.org/v2/identify/all?api-key=2b10MMxKgs5SPRsf4ENGAXzku'
    body.append('organs', image.organ);
    body.append('images', {
        uri: image.uri.replace('file://', ''),
        type: 'image/jpeg'
    });

    try {
        const response = await FileSystem.uploadAsync(Url, image.uri, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
            fieldName: "images",
            httpMethod: "POST",
            uploadType: FileSystem.FileSystemUploadType.MULTIPART,
            parameters: {
                "organs": image.organ
            }
        })
        parsed = JSON.parse(response.body)
        if (parsed.statusCode) {
            return {error: true, message: parsed.message}
        } else {
            result = parsed.results[0]
            console.log("Plant data retrieved.")
            return {
                error: false,
                result: {
                    name: result.species.scientificNameWithoutAuthor,
                    score: result.score
                }
            }
        }

    } catch (error) {
        console.log(error)
        return {error: true, message: "Detection API error..."}
    }
}


export async function process_image(image, navigation) {

    return Promise.all([getCurrentLocation(), detectPlantLocal(image)]).then(result => {
        if (result[1].error) {
            Toast.show({type: 'error', text1: result[1].message, visibilityTime: 2000});
            return 0;
        } else {
            return {
                ...result[1].result,
                ...result[0].result
            };
        }
    })
}
