/*
 *  The JavaScript file for handling the current user's state for BlueBook.
 *
 * @author Abby Mapes
 */
import firebase from 'firebase';
import { FIREBASE_FIRESTORE } from './secrets/secrets';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: FIREBASE_FIRESTORE.API_KEY,
    authDomain: FIREBASE_FIRESTORE.AUTH_DOMAIN,
    projectId: FIREBASE_FIRESTORE.PROJECT_ID,
    storageBucket: FIREBASE_FIRESTORE.STORAGE_BUCKET,
    messagingSenderId: FIREBASE_FIRESTORE.MESSAGING_SENDER_ID,
    appId: FIREBASE_FIRESTORE.APP_ID,
    measurementId: FIREBASE_FIRESTORE.MEASUREMENT_ID,
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const currentUid = 'testId';
const loggedIn = true;

// Initialize server
const useRemoteServer = true;
const SERVER_URL = useRemoteServer ? 'https://tranquil-hollows-68915.herokuapp.com' : '';

export default {
    db, currentUid, loggedIn, SERVER_URL,
};
