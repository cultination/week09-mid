import { fetchEventById } from '../services/eventService';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { app as firebaseApp } from '../services/firebaseConfig';

const app = initializeApp(firebaseApp);
const db = getFirestore(app);

async function fetchEventIdsFromFirestore() {
  const querySnapshot = await getDocs(collection(db, 'events'));
  const eventIds = [];

  querySnapshot.forEach((doc) => {
    eventIds.push(doc.id);
  });

  return eventIds;
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

export async function getStaticPaths() {
  const eventIds = await fetchEventIdsFromFirestore();

  const paths = eventIds.map((id) => ({
    params: { id },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const eventId = params.id;

  const event = await fetchEventById(eventId);

  return {
    props: {
      event,
    },
  };
}