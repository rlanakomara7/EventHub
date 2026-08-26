import EventCard from "../../components/EventCard";
import MyEventsFilter from "../../components/MyEventsFilter";
import { useNavigate } from "react-router";
import { useState } from "react";

function MyEvents() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("saved");

  const [registeredEvents, setRegisteredEvents] = useState(() => {
    return JSON.parse(localStorage.getItem("registeredEvents")) || [];
  });

  function handleEventClick(eventId) {
    navigate(`/event/${eventId}`);
  }

  function handleUnregister(eventId) {
    const updatedEvents = registeredEvents.filter(
      (event) => String(event.id) !== String(eventId),
    );

    // UPDATE LOCAL STORAGE
    localStorage.setItem("registeredEvents", JSON.stringify(updatedEvents));

    // UPDATE STATE
    setRegisteredEvents(updatedEvents);
  }

  return (
    <>
      <div className="mx-auto max-w-6xl px-6 py-5">
        <h1 className="font-bold text-3xl text-black-primary">My Events</h1>
        <MyEventsFilter activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <section className="min-h-screen bg-white-secondary py-6">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {activeTab === "saved" &&
              registeredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isRegistered={true}
                  onEventClick={handleEventClick}
                  onUnregister={handleUnregister}
                />
              ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default MyEvents;
