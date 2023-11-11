import React, { useState, useEffect } from 'react';
import { fetchEvents } from '../services/eventService';
import firebaseConfig from '../services/firebaseConfig';

function Events() {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
  });
  const [editEvent, setEditEvent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore(app);
      const eventsCollection = collection(db, 'events');

      try {
        const querySnapshot = await getDocs(eventsCollection);
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setEvents(items);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchData();
  }, []);

  const handleCreateEvent = async () => {
    if (!newEvent.title) return;

    const db = getFirestore(app);
    const eventsCollection = collection(db, 'events');

    try {
      const docRef = await addDoc(eventsCollection, newEvent);

      setEvents((prevEvents) => [
        ...prevEvents,
        {
          id: docRef.id,
          ...newEvent,
        },
      ]);

      setNewEvent({
        title: '',
        date: '',
        location: '',
        description: '',
      });
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleEditEvent = async () => {
    if (!editEvent) return;

    const db = getFirestore(app);
    const eventDoc = doc(db, 'events', editEvent.id);

    try {
      await updateDoc(eventDoc, editEvent);

      setEditEvent(null);
    } catch (error) {
      console.error('Error editing event:', error);
    }
  };

  const handleDeleteEvent = async (event) => {
    const db = getFirestore(app);
    const eventDoc = doc(db, 'events', event.id);

    try {
      await deleteDoc(eventDoc);

      setEvents((prevEvents) => prevEvents.filter((item) => item.id !== event.id));
    } catch (error) {
      console.error('Error deleting event:', error);
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
                  value={editEvent.title}
                  onChange={(e) => setEditEvent({ ...editEvent, title: e.target.value })}
                />
                <input
                  type="text"
                  value={editEvent.date}
                  onChange={(e) => setEditEvent({ ...editEvent, date: e.target.value })}
                />
                <input
                  type="text"
                  value={editEvent.location}
                  onChange={(e) => setEditEvent({ ...editEvent, location: e.target.value })}
                />
                <input
                  type="text"
                  value={editEvent.description}
                  onChange={(e) => setEditEvent({ ...editEvent, description: e.target.value })}
                />
                <button onClick={handleEditEvent}>Save</button>
              </div>
            ) : (
              <div>
                <strong>{event.title}</strong>
                <p>Date: {event.date}</p>
                <p>Location: {event.location}</p>
                <p>Description: {event.description}</p>
                <button onClick={() => setEditEvent(event)}>Edit</button>
                <button onClick={() => handleDeleteEvent(event)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>

      <div>
        <input
          type="text"
          placeholder="Title"
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Date"
          value={newEvent.date}
          onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
        />
        <input
          type="text"
          placeholder="Location"
          value={newEvent.location}
          onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newEvent.description}
          onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
        />
        <button onClick={handleCreateEvent}>Create</button>
      </div>
    </div>
  );
}

export default Events;
