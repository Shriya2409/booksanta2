import firebase from "firebase";
require('@firebase/firestore')


 
 var firebaseConfig = {
    apiKey: "AIzaSyDN3Pkxz_GOXWRA2KNJ5AzuDk4wnCZXDGI",
    authDomain: "booksanta-aaf88.firebaseapp.com",
    projectId: "booksanta-aaf88",
    storageBucket: "booksanta-aaf88.appspot.com",
    messagingSenderId: "272544301990",
    appId: "1:272544301990:web:cb586f404a113999a50567"
  };
 
  firebase.initializeApp(firebaseConfig);


export default firebase.firestore();