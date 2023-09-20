import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC_Wu8Nd_qegCjqy-_BGr6sjY_hlhUrMn8",
  authDomain: "twit-b20ce.firebaseapp.com",
  projectId: "twit-b20ce",
  storageBucket: "twit-b20ce.appspot.com",
  messagingSenderId: "368650213173",
  appId: "1:368650213173:web:7f34441b753483ac3a9e7c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export const storage = getStorage(app);
