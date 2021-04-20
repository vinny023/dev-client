import firebase from 'firebase'

// Optionally import the services that you want to use
//import "firebase/auth";
//import "firebase/database";
//import "firebase/firestore";
//import "firebase/functions";
//import "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAel4Ja-62ETZinnz0gaXnM7hwA1d_4_OU",
  authDomain: "supplyhero-1605397286974.firebaseapp.com",
  databaseURL: "https://supplyhero-1605397286974-default-rtdb.firebaseio.com",
  projectId: "supplyhero-1605397286974",
  storageBucket: "supplyhero-1605397286974.appspot.com",
  messagingSenderId: "672632298398",
  appId: "1:672632298398:web:2bd6f5ac0351225e6f148f",
  measurementId: "G-5V869NVQCS"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

export default firebaseApp


