import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
 
const firebaseConfig = {
  apiKey: "AIzaSyDqvpQK5WGmreqH96aM72QWV4PW_vX6odI",
  authDomain: "kingandqueen-78d0a.firebaseapp.com",
  projectId: "kingandqueen-78d0a",
  storageBucket: "kingandqueen-78d0a.firebasestorage.app",
  messagingSenderId: "105940305854",
  appId: "1:105940305854:web:721b71d63a3115ff255bef"
};
 
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);