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
import { VStack, Box, FormControl, Input, Button, HStack } from '@chakra-ui/react'; // Added HStack import

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
    <VStack align="start" spacing={4}>
      <h2>Events</h2>
      <Box>
        {events.map((event) => (
          <Box key={event.id}>
            {editEvent === event ? (
              <VStack spacing={2}>
                <FormControl>
                  <Input
                    type="text"
                    value={editEvent.title}
                    onChange={(e) => setEditEvent({ ...editEvent, title: e.target.value })}
                  />
                </FormControl>
                <FormControl>
                  <Input
                    type="text"
                    value={editEvent.date}
                    onChange={(e) => setEditEvent({ ...editEvent, date: e.target.value })}
                  />
                </FormControl>
                <FormControl>
                  <Input
                    type="text"
                    value={editEvent.location}
                    onChange={(e) => setEditEvent({ ...editEvent, location: e.target.value })}
                  />
                </FormControl>
                <FormControl>
                  <Input
                    type="text"
                    value={editEvent.description}
                    onChange={(e) => setEditEvent({ ...editEvent, description: e.target.value })}
                  />
                </FormControl>
                <Button onClick={handleEditEvent}>Save</Button>
              </VStack>
            ) : (
              <VStack spacing={2}>
                <strong>{event.title}</strong>
                <p>Date: {event.date}</p>
                <p>Location: {event.location}</p>
                <p>Description: {event.description}</p>
                <HStack spacing={2}>
                  <Button onClick={() => setEditEvent(event)}>Edit</Button>
                  <Button onClick={() => handleDeleteEvent(event)}>Delete</Button>
                </HStack>
              </VStack>
            )}
          </Box>
        ))}
      </Box>

      <VStack spacing={2}>
        <FormControl>
          <Input
            type="text"
            placeholder="Title"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          />
        </FormControl>
        <FormControl>
          <Input
            type="text"
            placeholder="Date"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
          />
        </FormControl>
        <FormControl>
          <Input
            type="text"
            placeholder="Location"
            value={newEvent.location}
            onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
          />
        </FormControl>
        <FormControl>
          <Input
            type="text"
            placeholder="Description"
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
          />
        </FormControl>
        <Button onClick={handleCreateEvent}>Create</Button>
      </VStack>
    </VStack>
  );
}

export default Events;
