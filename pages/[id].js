import { getStaticProps } from 'next';
import { fetchEventById, fetchEventIdsFromFirestore } from '../services/eventService';

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
