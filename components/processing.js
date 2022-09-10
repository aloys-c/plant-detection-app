import * as Location from 'expo-location'
import {getDownloadURL, getStorage,ref,uploadBytes} from "firebase/storage";
import { collection, addDoc, getFirestore, getDocs } from "firebase/firestore"; 



export const uriToBlob = (uri) => {

    return new Promise((resolve, reject) => {

      const xhr = new XMLHttpRequest();

      xhr.onload = function() {
        // return the blob
        resolve(xhr.response);
      };
      
      xhr.onerror = function() {
        // something went wrong
        reject(new Error('uriToBlob failed'));
      };

      // this helps us get a blob
      xhr.responseType = 'blob';

      xhr.open('GET', uri, true);
      xhr.send(null);

    });

  }

  export const uploadToFirebase = (blob,file) => {

    return new Promise((resolve, reject)=>{
      const storage = getStorage();
      var storageRef = ref(storage,file);

      uploadBytes(storageRef, blob).then((snapshot)=>{

        blob.close();

        resolve(snapshot);

      }).catch((error)=>{

        reject(error);

      });

    });
  }   

  export async function writeToFirebase(coll,doc){
    const db = getFirestore();

    try {
        const docRef = await addDoc(collection(db, coll), 
        doc
        );
        console.log("Document written with ID: ", docRef.id);
        return docRef.id
      } catch (e) {
        console.error("Error adding document: ", e);
        return 0
      }
  }

export function updateObject(obj,key,value){
    obj.key = value
    return obj
}

export const randomStr = (length = 8) => {
    // Declare all characters
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    // Pick characers randomly
    let str = '';
    for (let i = 0; i < length; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return str;

};

export async function readFromFirebase(coll){
    const db = getFirestore();
    const querySnapshot = await getDocs(collection(db, coll));
    return querySnapshot;
}
  
  export function  getImageURL(file){
    const storage = getStorage();
    const storageRef = ref(storage, file);
    return getDownloadURL(storageRef)
  } 

  export async function detectPlant(imURL,organ){
    let Url = 'https://my-api.plantnet.org/v2/identify/all?api-key=2b10MMxKgs5SPRsf4ENGAXzku'
    let request = Url+"&images="+imURL.slice(0,imURL.lastIndexOf('&'))+"&organs="+organ
    return fetch(request).then((response) => {if(!response.ok) {
      return response.json().then((json) => {return {error:json.message}})
      } else {return response.json().then((json) => {
        let result = json.results[0]
        console.log("PlantData retrieved.")
        return {error: false,result:{name:result.species.scientificNameWithoutAuthor,score:result.score}}})} }).catch((e)=>{return {error:"API error"}})
    }

    export const getCurrentLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
      
        if (status !== 'granted') {
          Alert.alert(
            'Permission not granted',
            'Allow the app to use location service.',
            [{ text: 'OK' }],
            { cancelable: false }
          );
        }
      
        let { coords } = await Location.getCurrentPositionAsync();
      
        if (coords) {
          const { latitude, longitude } = coords;
          let response = await Location.reverseGeocodeAsync({
            latitude,
            longitude
          });
          return Promise.resolve(response).then(response =>{
            response = response[0]
            console.log("GeoData retrieved.")
            return {error:false,result:{city:response.city,country:response.country,street:response.street,lat:latitude,lon:longitude}}
          })
      
        }
      }