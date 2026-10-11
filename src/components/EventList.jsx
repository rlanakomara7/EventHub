import EventCard from "./EventCard";

function EventList({
  events = [],
  onAuthRequired,
  onEventClick,
  onSavedChange,
}) {
  return (
    <div className="grid w-full min-w-0 max-w-full grid-cols-1 items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3">
      {events.map((event) => (
        <div key={event.event_id ?? event.id} className="min-w-0">
          <EventCard
            event={event}
            onAuthRequired={onAuthRequired}
            onEventClick={onEventClick}
            onSavedChange={onSavedChange}
          />
        </div>
      ))}
    </div>
  );
}

export default EventList;
