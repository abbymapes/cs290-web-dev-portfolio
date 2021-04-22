/*
 *  The JavaScript file for handling the current user's state for BlueBook.
 *
 * @author Abby Mapes
 */
import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/auth';
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
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();

const currentUser = {
    userId: '',
};

// Initialize server
const useRemoteServer = true;
const SERVER_URL = useRemoteServer ? 'https://tranquil-hollows-68915.herokuapp.com' : '';

async function storeProfileImage(userId, file) {
    const ref = storage.ref().child(`profile/${userId}.jpg`);
    await ref.put(file).then((snapshot) => {
        console.log(snapshot);
        console.log('Uploaded user file!');
    }).catch((error) => {
        throw new Error(`Error uploading profile image for user ${userId}: ${error}`);
    });
    const imageUrl = await ref.getDownloadURL().then((url) => url).catch((error) => {
        throw new Error(`Error uploading profile image for user ${userId}: ${error}`);
    });
    return imageUrl;
}
async function deleteUser() {
    try {
        const user = auth.currentUser;
        user.delete().then(() => {
            console.log('User deleted');
        });
        currentUser.userId = '';
    } catch {
        console.log('Error deleting user');
    }
}

async function updateUser(user) {
    if (user) {
        if (user.uid !== currentUser.userId) {
            currentUser.userId = user.uid;
            const response = await fetch(
                `${SERVER_URL}/bluebook/updateUserVisits?userId=${user.uid}`,
            );
            if (response.ok) {
                console.log('Updated user visit count.');
            } else {
                console.log('Failed to update user visit count.');
            }
        }
    } else {
        currentUser.userId = '';
    }
}

export default {
    currentUser, auth, SERVER_URL, storeProfileImage, deleteUser, updateUser,
};
