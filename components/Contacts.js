import React, { useState, useEffect } from 'react';
import { app } from '../firebaseConfig';
import { getFirestore, collection, addDoc, doc, updateDoc, deleteDoc, getDocs } from 'firebase/firestore';

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
          name: newContactName,
          email: newContactEmail,
          phone: newContactPhone,
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

      setContacts((prevContacts) => prevContacts.filter((item) => item.id !== contact.id));
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  return (
    <div>
      <h2>Contacts</h2>
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            {editContact === contact ? (
              <div>
                <input
                  type="text"
                  placeholder="Name"
                  value={editContact.name}
                  onChange={(e) =>
                    setEditContact({ ...editContact, name: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Email"
                  value={editContact.email}
                  onChange={(e) =>
                    setEditContact({ ...editContact, email: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={editContact.phone}
                  onChange={(e) =>
                    setEditContact({ ...editContact, phone: e.target.value })
                  }
                />
                <button onClick={handleEditContact}>Save</button>
              </div>
            ) : (
              <div>
                <strong>Name:</strong> {contact.name}<br />
                <strong>Email:</strong> {contact.email}<br />
                <strong>Phone:</strong> {contact.phone}
                <button onClick={() => setEditContact(contact)}>Edit</button>
                <button onClick={() => handleDeleteContact(contact)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          placeholder="Name"
          value={newContactName}
          onChange={(e) => setNewContactName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Email"
          value={newContactEmail}
          onChange={(e) => setNewContactEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone"
          value={newContactPhone}
          onChange={(e) => setNewContactPhone(e.target.value)}
        />
        <button onClick={handleCreateContact}>Create</button>
      </div>
    </div>
  );
}

export default Contacts;
