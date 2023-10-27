import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';

function Events() {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ name: '', date: '', description: '' });
  const [editEvent, setEditEvent] = useState(null);

  // Fetch events from Firestore when the component loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = firebase.auth().currentUser;
        if (user) {
          const snapshot = await firebase
            .firestore()
            .collection(`users/${user.uid}/events`)
            .get();
          const items = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setEvents(items);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchData();
  }, []);

  // Handle creating a new event
  const handleCreateEvent = async () => {
    try {
      const user = firebase.auth().currentUser;
      if (user && newEvent.name && newEvent.date) {
        await firebase
          .firestore()
          .collection(`users/${user.uid}/events`)
          .add({
            name: newEvent.name,
            date: newEvent.date,
            description: newEvent.description,
            // Add other event fields as needed
          });

        setNewEvent({ name: '', date: '', description: '' }); // Clear the input fields
      }
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  // Handle editing an event
  const handleEditEvent = async () => {
    if (editEvent) {
      try {
        const user = firebase.auth().currentUser;
        if (user) {
          await firebase
            .firestore()
            .doc(`users/${user.uid}/events/${editEvent.id}`)
            .update({
              name: editEvent.name,
              date: editEvent.date,
              description: editEvent.description,
              // Update other event fields as needed
            });

          setEditEvent(null); // Clear the editing state
        }
      } catch (error) {
        console.error('Error editing event:', error);
      }
    }
  };

  return (
    <div>
      <h2>Events</h2>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            {editEvent === event ? (
              <div>
                <input
                  type="text"
                  value={editEvent.name}
                  onChange={(e) => setEditEvent({ ...editEvent, name: e.target.value })}
                />
                <input
                  type="text"
                  value={editEvent.date}
                  onChange={(e) => setEditEvent({ ...editEvent, date: e.target.value })}
                />
                <input
                  type="text"
                  value={editEvent.description}
                  onChange={(e) => setEditEvent({ ...editEvent, description: e.target.value })}
                />
                {/* Add fields for other event properties here */}
                <button onClick={handleEditEvent}>Save</button>
              </div>
            ) : (
              <div>
                {event.name} - {event.date}
                {/* Display other event fields here */}
                <button onClick={() => setEditEvent(event)}>Edit</button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          placeholder="Event Name"
          value={newEvent.name}
          onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Event Date"
          value={newEvent.date}
          onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
        />
        <input
          type="text"
          placeholder="Event Description"
          value={newEvent.description}
          onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
        />
        {/* Add fields for other event properties here */}
        <button onClick={handleCreateEvent}>Create Event</button>
      </div>
    </div>
  );
}

export default Events;
