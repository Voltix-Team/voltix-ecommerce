import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD90iLWcPXh_XOnW6d6VfHh-Tsp1zGN604",
  authDomain: "voltix-ecommerce.firebaseapp.com",
  projectId: "voltix-ecommerce",
  storageBucket: "voltix-ecommerce.firebasestorage.app",
  messagingSenderId: "378216522689",
  appId: "1:378216522689:web:38ee2528c4a9a036c80540",
  measurementId: "G-P7F1TB6Y7K"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 
