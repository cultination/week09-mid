import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { initializeApp } from '../services/firebaseConfig';

function DynamicPage({ event }) {
  const [isFirebaseInitialized, setIsFirebaseInitialized] = useState(false);

  useEffect(() => {
    if (!isFirebaseInitialized) {
      initializeApp();
      setIsFirebaseInitialized(true);
    }
  }, [isFirebaseInitialized]);

  if (!isFirebaseInitialized) {
    return <p>Loading...</p>;
  }

  if (!event) {
    return <p>Event not found</p>;
  }

  return (
    <div>
      <h1>Dynamic Page for ID: {event.id}</h1>
      <h2>{event.title}</h2>
      <p>{event.description}</p>
    </div>
  );
}

export default DynamicPage;

export async function getStaticPaths() {
  const db = getFirestore();
  const eventsCollection = collection(db, 'events');
  const querySnapshot = await getDocs(eventsCollection);

  const paths = [];
  querySnapshot.forEach((doc) => {
    paths.push({
      params: { id: doc.id },
    });
  });

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const db = getFirestore();
  const eventDoc = doc(db, 'events', params.id);
  const eventSnapshot = await getDoc(eventDoc);
  const event = eventSnapshot.data();

  return {
    props: {
      event,
    },
  };
}
