// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCZlrMwaEPOL8-K8CEQn16f4tkFTz792BE",
    authDomain: "alzheimers-platform.firebaseapp.com",
    projectId: "alzheimers-platform",
    storageBucket: "alzheimers-platform.firebasestorage.app",
    messagingSenderId: "292471233716",
    appId: "1:292471233716:web:6982d0ce4f2e847a300be1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 2. Export the Auth service (This is what was missing/wrong!)
export const auth = getAuth(app);

// 3. Export the Google Provider
export const googleProvider = new GoogleAuthProvider();

