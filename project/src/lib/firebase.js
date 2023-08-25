// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider, signInWithPopup} from 'firebase/auth';

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
const auth = getAuth(app)
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

export {app, provider, signInWithPopup, signOutUser, auth}