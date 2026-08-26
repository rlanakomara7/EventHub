import EventCard from "./EventCard";

function EventList({ events, onAuthRequired, onEventClick }) {
  return (
    <>
      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 m-4 px-5">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onAuthRequired={onAuthRequired}
            onEventClick={onEventClick}
          />
        ))}
      </main>
      <div className="flex justify-center mt-6">
        <button
          type="button"
          className="rounded-xl border border-gray-secondary/40 px-6 py-2 text-gray-secondary font-semibold"
        >
          Load More Events
        </button>
      </div>
    </>
  );
}

export default EventList;
