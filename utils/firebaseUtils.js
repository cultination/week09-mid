import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

// Initialize Firebase with your config (import your config as needed)
const firebaseConfig = {
  // Your Firebase config object
};

firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();

// Function to fetch a collection from Firestore
export const fetchCollection = async (collectionPath) => {
  try {
    const user = firebase.auth().currentUser;
    if (user) {
      const snapshot = await firestore.collection(collectionPath).get();
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching collection:', error);
    return [];
  }
};

// Function to add a new item to a collection in Firestore
export const addItemToCollection = async (collectionPath, data) => {
  try {
    const user = firebase.auth().currentUser;
    if (user) {
      await firestore.collection(collectionPath).add(data);
    }
  } catch (error) {
    console.error('Error adding item to collection:', error);
  }
};

// Function to update an item in a collection in Firestore
export const updateItemInCollection = async (collectionPath, itemId, data) => {
  try {
    const user = firebase.auth().currentUser;
    if (user) {
      await firestore.doc(`${collectionPath}/${itemId}`).update(data);
    }
  } catch (error) {
    console.error('Error updating item in collection:', error);
  }
};

// Function to delete an item from a collection in Firestore
export const deleteItemFromCollection = async (collectionPath, itemId) => {
  try {
    const user = firebase.auth().currentUser;
    if (user) {
      await firestore.doc(`${collectionPath}/${itemId}`).delete();
    }
  } catch (error) {
    console.error('Error deleting item from collection:', error);
  }
};
