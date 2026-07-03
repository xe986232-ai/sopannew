import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDQJ0dFT8ohAkwDODrdfDa2GEwzk0kZRm0",
  authDomain: "labelmusic-ee1b2.firebaseapp.com",
  databaseURL: "https://labelmusic-ee1b2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "labelmusic-ee1b2",
  storageBucket: "labelmusic-ee1b2.firebasestorage.app",
  messagingSenderId: "634541524714",
  appId: "1:634541524714:web:a2fc9d47a91e37f44a7993",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);