// src/firebaseConfig.js
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAWl-8PzDMydysCY02LwZsC-6Di3ixZVe0",
  authDomain: "vanitybiolink.firebaseapp.com",
  projectId: "vanitybiolink",
  storageBucket: "vanitybiolink.appspot.com",
  messagingSenderId: "688528490749",
  appId: "1:688528490749:web:07211d0a71015c4d997e94",
  measurementId: "G-DM8ZKMNWZF"
};

const app = initializeApp(firebaseConfig);

export default app;
