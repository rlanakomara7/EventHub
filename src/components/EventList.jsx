import EventCard from "./EventCard";

function EventList({ events, onAuthRequired, onEventClick }) {
  return (
    <>
      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onAuthRequired={onAuthRequired}
            onEventClick={onEventClick}
          />
        ))}
      </main>
    </>
  );
}

export default EventList;
