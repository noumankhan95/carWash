// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyANo5c1-lDzS7ybzo0zxO4x3VHZliOo9Vs",
    authDomain: "carwash-9f3d6.firebaseapp.com",
    projectId: "carwash-9f3d6",
    storageBucket: "carwash-9f3d6.appspot.com",
    messagingSenderId: "893516301657",
    appId: "1:893516301657:web:03b9851c215aac73593848"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)