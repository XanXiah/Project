import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAXgoFYtKcR5s53b44n3RTVqk01NAWB_qE",
  authDomain: "gradproject-4c643.firebaseapp.com",
  projectId: "gradproject-4c643",
  storageBucket: "gradproject-4c643.appspot.com",
  messagingSenderId: "1021809451956",
  appId: "1:1021809451956:web:7d4631045bbe7ba847c8e1"
};

firebase.initializeApp(firebaseConfig)
const fireauth = firebase.auth();

export default fireauth