// pages/[id].js

import { getStaticPaths, getStaticProps } from 'next';
import { fetchEventById, fetchEventIdsFromFirestore } from '../services/eventService'; // Import your fetchEventById and fetchEventIdsFromFirestore functions

export async function getStaticPaths() {
  // Fetch the list of event IDs from Firestore
  const eventIds = await fetchEventIdsFromFirestore(); // Implement this function

  // Generate dynamic paths based on the event IDs
  const paths = eventIds.map((id) => ({
    params: { id },
  }));

  return {
    paths,
    fallback: false, // or 'blocking' or true
  };
}

export async function getStaticProps({ params }) {
  const eventId = params.id;

  // Fetch event details from Firestore using the eventId
  const event = await fetchEventById(eventId);

  return {
    props: {
      event,
    },
  };
}

function DynamicPage({ event }) {
  return (
    <div>
      <h1>Dynamic Page for ID: {event.id}</h1>
      <h2>{event.title}</h2>
      <p>{event.description}</p>
    </div>
  );
}

export default DynamicPage;
