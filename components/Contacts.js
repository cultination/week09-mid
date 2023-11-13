import React, { useState, useEffect } from 'react';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { app } from '../services/firebaseConfig';
import { VStack, Box, FormControl, Input, Button } from '@chakra-ui/react';

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [newContactName, setNewContactName] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [editContact, setEditContact] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore(app);
      const contactsCollection = collection(db, 'contacts');

      try {
        const querySnapshot = await getDocs(contactsCollection);
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setContacts(items);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    fetchData();
  }, []);

  const handleCreateContact = async () => {
    if (!newContactName || !newContactEmail || !newContactPhone) return;

    const db = getFirestore(app);
    const contactsCollection = collection(db, 'contacts');

    try {
      const docRef = await addDoc(contactsCollection, {
        name: newContactName,
        email: newContactEmail,
        phone: newContactPhone,
      });

      setContacts((prevContacts) => [
        ...prevContacts,
        {
          id: docRef.id,
          ...{
            name: newContactName,
            email: newContactEmail,
            phone: newContactPhone,
          },
        },
      ]);

      setNewContactName('');
      setNewContactEmail('');
      setNewContactPhone('');
    } catch (error) {
      console.error('Error creating contact:', error);
    }
  };

  const handleEditContact = async () => {
    if (!editContact) return;

    const db = getFirestore(app);
    const contactDoc = doc(db, 'contacts', editContact.id);

    try {
      await updateDoc(contactDoc, {
        name: editContact.name,
        email: editContact.email,
        phone: editContact.phone,
      });

      setEditContact(null);
    } catch (error) {
      console.error('Error editing contact:', error);
    }
  };

  const handleDeleteContact = async (contact) => {
    const db = getFirestore(app);
    const contactDoc = doc(db, 'contacts', contact.id);

    try {
      await deleteDoc(contactDoc);

      setContacts((prevContacts) =>
        prevContacts.filter((item) => item.id !== contact.id)
      );
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  return (
    <VStack align="start" spacing={4}>
      <h2>Contacts</h2>
      <Box>
        {contacts.map((contact) => (
          <Box key={contact.id}>
            {editContact === contact ? (
              <VStack spacing={2}>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Name"
                    value={editContact.name}
                    onChange={(e) =>
                      setEditContact({ ...editContact, name: e.target.value })
                    }
                  />
                </FormControl>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Email"
                    value={editContact.email}
                    onChange={(e) =>
                      setEditContact({ ...editContact, email: e.target.value })
                    }
                  />
                </FormControl>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Phone"
                    value={editContact.phone}
                    onChange={(e) =>
                      setEditContact({ ...editContact, phone: e.target.value })
                    }
                  />
                </FormControl>
                <Button onClick={handleEditContact}>Save</Button>
              </VStack>
            ) : (
              <VStack spacing={2}>
                <strong>Name:</strong> {contact.name}<br />
                <strong>Email:</strong> {contact.email}<br />
                <strong>Phone:</strong> {contact.phone}
                <Button onClick={() => setEditContact(contact)}>Edit</Button>
                <Button onClick={() => handleDeleteContact(contact)}>Delete</Button>
              </VStack>
            )}
          </Box>
        ))}
      </Box>

      <VStack spacing={2}>
        <FormControl>
          <Input
            type="text"
            placeholder="Name"
            value={newContactName}
            onChange={(e) => setNewContactName(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <Input
            type="text"
            placeholder="Email"
            value={newContactEmail}
            onChange={(e) => setNewContactEmail(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <Input
            type="text"
            placeholder="Phone"
            value={newContactPhone}
            onChange={(e) => setNewContactPhone(e.target.value)}
          />
        </FormControl>
        <Button onClick={handleCreateContact}>Create</Button>
      </VStack>
    </VStack>
  );
}

export default Contacts;
