// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCT01oN9cJQQPX_c6RczwYfqd3ztKg2xvg",
    authDomain: "alzimer-115e1.firebaseapp.com",
    projectId: "alzimer-115e1",
    storageBucket: "alzimer-115e1.firebasestorage.app",
    messagingSenderId: "747878501291",
    appId: "1:747878501291:web:8de5f82c3135bff553e0ee"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 2. Export the Auth service (This is what was missing/wrong!)
export const auth = getAuth(app);

// 3. Export the Google Provider
export const googleProvider = new GoogleAuthProvider();

