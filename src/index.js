import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged} from 'firebase/auth';
import { getFirestore} from 'firebase/firestore';
// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = initializeApp({
    apiKey: "AIza....",                             // Auth / General Use
    authDomain: "YOUR_APP.firebaseapp.com",         // Auth with popup/redirect
    databaseURL: "https://YOUR_APP.firebaseio.com", // Realtime Database
    storageBucket: "YOUR_APP.appspot.com",          // Storage
    messagingSenderId: "123456789"                  // Cloud Messaging
});
const auth = getAuth(firebaseApp);
const db =getFirestore(firebaseApp);
onAuthStateChanged(auth, user => {

});