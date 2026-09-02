import EventCard from "../../components/EventCard";
import MyEventsFilter from "../../components/MyEventsFilter";
import { useNavigate } from "react-router";
import { useState } from "react";

function readStorage(key) {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function MyEvents() {
  const navigate = useNavigate();

  // REVISI 1: tab awal adalah Upcoming
  const [activeTab, setActiveTab] = useState("upcoming");

  // REVISI 2: data Join dan Save dipisahkan
  const [registeredEvents, setRegisteredEvents] = useState(() =>
    readStorage("registeredEvents"),
  );

  const [savedEvents, setSavedEvents] = useState(() =>
    readStorage("savedEvents"),
  );

  function handleEventClick(eventId) {
    navigate(`/event/${eventId}`);
  }

  // REVISI 3: fungsi Join dan Unregister
  function handleToggleRegistered(event) {
    const alreadyRegistered = registeredEvents.some(
      (item) => String(item.id) === String(event.id),
    );

    const updatedEvents = alreadyRegistered
      ? registeredEvents.filter((item) => String(item.id) !== String(event.id))
      : [...registeredEvents, event];

    localStorage.setItem("registeredEvents", JSON.stringify(updatedEvents));

    setRegisteredEvents(updatedEvents);
  }

  // REVISI 4: fungsi menghapus atau menambah Saved
  function handleSavedChange(event, isSaved) {
    const updatedEvents = isSaved
      ? savedEvents.some((item) => String(item.id) === String(event.id))
        ? savedEvents
        : [...savedEvents, event]
      : savedEvents.filter((item) => String(item.id) !== String(event.id));

    localStorage.setItem("savedEvents", JSON.stringify(updatedEvents));

    setSavedEvents(updatedEvents);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // REVISI 5: event terdaftar yang akan datang
  const upcomingEvents = registeredEvents.filter((event) => {
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);

    return eventDate >= today;
  });

  // REVISI 6: event terdaftar yang sudah lewat
  const pastEvents = registeredEvents.filter((event) => {
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);

    return eventDate < today;
  });

  // REVISI 7: menentukan card sesuai tab aktif
  const visibleEvents =
    activeTab === "upcoming"
      ? upcomingEvents
      : activeTab === "past"
        ? pastEvents
        : savedEvents;

  return (
    <>
      <div className="mx-auto max-w-6xl px-6 py-5">
        <h1 className="text-3xl font-bold text-black-primary">My Events</h1>

        {/* REVISI 8: kirim jumlah ke tab */}
        <MyEventsFilter
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          counts={{
            upcoming: upcomingEvents.length,
            past: pastEvents.length,
            saved: savedEvents.length,
          }}
        />
      </div>

      <section className="min-h-screen bg-white-secondary py-6">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visibleEvents.length > 0 ? (
              visibleEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isRegistered={registeredEvents.some(
                    (item) => String(item.id) === String(event.id),
                  )}
                  onEventClick={handleEventClick}
                  // REVISI 9: Join atau Registered
                  onAuthRequired={() => handleToggleRegistered(event)}
                  // REVISI 10: Save atau Unsave
                  onSavedChange={handleSavedChange}
                />
              ))
            ) : (
              <p className="text-sm text-gray-secondary">
                No saved events. Bookmark to find them later.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default MyEvents;
