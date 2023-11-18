import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCiwt2KAHSZIOlEkaD-JTZlRIPXQkArF70",
  authDomain: "fir-47a99.firebaseapp.com",
  projectId: "fir-47a99",
  storageBucket: "fir-47a99.appspot.com",
  messagingSenderId: "1062352605699",
  appId: "1:1062352605699:web:7ae4c3848e5ad0d941f436",
  measurementId: "G-VFN5KQ8GFN"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()
