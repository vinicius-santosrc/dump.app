// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";
import 'firebase/compat/firestore'
import 'firebase/compat/storage'
import {getAuth, GoogleAuthProvider, signInWithPopup} from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBMYYq5djqW5cMaDFiCDmCLL1XB5BvSGbM",
  authDomain: "dump-2755c.firebaseapp.com",
  projectId: "dump-2755c",
  storageBucket: "dump-2755c.appspot.com",
  messagingSenderId: "76321265454",
  appId: "1:76321265454:web:51a40625dbbedc610accbf",
  measurementId: "G-YSFYF4D6ZG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const app2 = firebase.initializeApp(firebaseConfig)

const auth = getAuth(app)
const db = getFirestore(app)

const database = app2.firestore();
const storage = firebase.storage();

const provider = new GoogleAuthProvider();
const signOutUser = () => {
    auth.signOut()
    .then (
        window.location.href= window.location.origin
    )
    .catch(e => {
        alert(e)
    })
}


export {db, app, provider, signInWithPopup, signOutUser, auth, storage,database}