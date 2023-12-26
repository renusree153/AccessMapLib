// Import the functions you need from the SDKs you need
//import * as firebase from "firebase/app";
import firebase from 'firebase/compat/app';
import firestore from "firebase/compat/firestore";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/compat/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbEvpwwDqQFkMHGA7WSKKVL5gURLG2C-g",
  authDomain: "emission-database-testapp2.firebaseapp.com",
  databaseURL: "https://emission-database-testapp2-default-rtdb.firebaseio.com",
  projectId: "emission-database-testapp2",
  storageBucket: "emission-database-testapp2.appspot.com",
  messagingSenderId: "631000886204",
  appId: "1:631000886204:web:beece18dc3791cd2bd59b9"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database1 = firebase.firestore;

export default database1; 
// Initialize database
