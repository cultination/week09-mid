import { getFirestore, collection, getDocs, doc, addDoc } from 'firebase/firestore';
import { app } from '../services/firebaseConfig';

const db = getFirestore(app);

// Function to fetch all events
export const fetchEvents = async () => {
  const eventsCollection = collection(db, 'events');
  const eventsSnapshot = await getDocs(eventsCollection);
  return eventsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Function to fetch an event by ID
export const fetchEventById = async (eventId) => {
  const eventDoc = doc(db, 'events', eventId);
  const eventSnapshot = await getDoc(eventDoc);
  return { id: eventSnapshot.id, ...eventSnapshot.data() };
};

// Function to add a new event
export const addEvent = async (eventData) => {
  const eventsCollection = collection(db, 'events');
  const newEventDocRef = await addDoc(eventsCollection, eventData);
  return newEventDocRef.id;
};

// Function to fetch all contacts
export const fetchContacts = async () => {
  const contactsCollection = collection(db, 'contacts');
  const contactsSnapshot = await getDocs(contactsCollection);
  return contactsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Function to fetch a contact by ID
export const fetchContactById = async (contactId) => {
  const contactDoc = doc(db, 'contacts', contactId);
  const contactSnapshot = await getDoc(contactDoc);
  return { id: contactSnapshot.id, ...contactSnapshot.data() };
};

export const fetchEventIdsFromFirestore = async () => {
  const db = getFirestore(app);
  const eventsCollection = collection(db, 'events');

  try {
    const eventsSnapshot = await getDocs(eventsCollection);
    const eventIds = eventsSnapshot.docs.map((doc) => doc.id);
    return eventIds;
  } catch (error) {
    console.error('Error fetching event IDs from Firestore:', error);
    return [];
  }
};

// Function to add a new contact
export const addContact = async (contactData) => {
  const contactsCollection = collection(db, 'contacts');
  const newContactDocRef = await addDoc(contactsCollection, contactData);
  return newContactDocRef.id;
};

// Function to fetch all todo items
export const fetchToDoItems = async () => {
  const todoItemsCollection = collection(db, 'todoitems');
  const todoItemsSnapshot = await getDocs(todoItemsCollection);
  return todoItemsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Function to fetch a todo item by ID
export const fetchToDoItemById = async (todoItemId) => {
  const todoItemDoc = doc(db, 'todoitems', todoItemId);
  const todoItemSnapshot = await getDoc(todoItemDoc);
  return { id: todoItemSnapshot.id, ...todoItemSnapshot.data() };
};

// Function to add a new todo item
export const addToDoItem = async (todoItemData) => {
  const todoItemsCollection = collection(db, 'todoitems');
  const newToDoItemDocRef = await addDoc(todoItemsCollection, todoItemData);
  return newToDoItemDocRef.id;
};
