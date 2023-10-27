import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({ name: '', phone: '', email: '', address: '' });
  const [editContact, setEditContact] = useState(null);

  // Fetch contacts from Firestore when the component loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = firebase.auth().currentUser;
        if (user) {
          const snapshot = await firebase
            .firestore()
            .collection(`users/${user.uid}/contacts`)
            .get();
          const items = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setContacts(items);
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    fetchData();
  }, []);

  // Handle creating a new contact
  const handleCreateContact = async () => {
    try {
      const user = firebase.auth().currentUser;
      if (user && newContact.name && newContact.phone && newContact.email) {
        await firebase
          .firestore()
          .collection(`users/${user.uid}/contacts`)
          .add({
            name: newContact.name,
            phone: newContact.phone,
            email: newContact.email,
            address: newContact.address,
            // Add other contact fields as needed
          });

        setNewContact({ name: '', phone: '', email: '', address: '' }); // Clear the input fields
      }
    } catch (error) {
      console.error('Error creating contact:', error);
    }
  };

  // Handle editing a contact
  const handleEditContact = async () => {
    if (editContact) {
      try {
        const user = firebase.auth().currentUser;
        if (user) {
          await firebase
            .firestore()
            .doc(`users/${user.uid}/contacts/${editContact.id}`)
            .update({
              name: editContact.name,
              phone: editContact.phone,
              email: editContact.email,
              address: editContact.address,
              // Update other contact fields as needed
            });

          setEditContact(null); // Clear the editing state
        }
      } catch (error) {
        console.error('Error editing contact:', error);
      }
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
                  value={editContact.name}
                  onChange={(e) => setEditContact({ ...editContact, name: e.target.value })}
                />
                <input
                  type="text"
                  value={editContact.phone}
                  onChange={(e) => setEditContact({ ...editContact, phone: e.target.value })}
                />
                <input
                  type="text"
                  value={editContact.email}
                  onChange={(e) => setEditContact({ ...editContact, email: e.target.value })}
                />
                <input
                  type="text"
                  value={editContact.address}
                  onChange={(e) => setEditContact({ ...editContact, address: e.target.value })}
                />
                {/* Add fields for other contact properties here */}
                <button onClick={handleEditContact}>Save</button>
              </div>
            ) : (
              <div>
                {contact.name} - {contact.email}
                {/* Display other contact fields here */}
                <button onClick={() => setEditContact(contact)}>Edit</button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          placeholder="Contact Name"
          value={newContact.name}
          onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Contact Phone"
          value={newContact.phone}
          onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
        />
        <input
          type="text"
          placeholder="Contact Email"
          value={newContact.email}
          onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Contact Address"
          value={newContact.address}
          onChange={(e) => setNewContact({ ...newContact, address: e.target.value })}
        />
        {/* Add fields for other contact properties here */}
        <button onClick={handleCreateContact}>Create Contact</button>
      </div>
    </div>
  );
}

export default Contacts;
