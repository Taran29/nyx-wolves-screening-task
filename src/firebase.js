import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCl7iPmIMW2pF-sX8HsDhvt3Ye43QepdVk",
  authDomain: "nyx-wolves-screening-project.firebaseapp.com",
  projectId: "nyx-wolves-screening-project",
  storageBucket: "nyx-wolves-screening-project.appspot.com",
  messagingSenderId: "475166117124",
  appId: "1:475166117124:web:6342bafb3a33c659f8d451",
  measurementId: "G-RC194GN20T"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app)

export default storage