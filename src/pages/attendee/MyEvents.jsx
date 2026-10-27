import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

import EventCard from "../../components/EventCard";
import MyEventsFilter from "../../components/MyEventsFilter";

import {
  fetchJoinedEvents,
  selectJoinedEvents,
  selectMemberLoading,
  selectMemberError,
} from "../../redux/slice/eventMemberSlice";

function getEventId(event) {
  return event.event_id ?? event.id;
}

function MyEvents() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("upcoming");

  const joinedEvents = useSelector(selectJoinedEvents) || [];
  const loading = useSelector(selectMemberLoading);
  const error = useSelector(selectMemberError);

  const [savedEvents, setSavedEvents] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("savedEvents") || "[]");
    } catch {
      return [];
    }
  });

  const now = new Date();

  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");

  const upcomingEvents = joinedEvents.filter((event) => {
    const date = String(event.event_date || event.date || "").slice(0, 10);
    return date && date >= today;
  });

  const pastEvents = joinedEvents.filter((event) => {
    const date = String(event.event_date || event.date || "").slice(0, 10);
    return date && date < today;
  });

  const visibleEvents =
    activeTab === "upcoming"
      ? upcomingEvents
      : activeTab === "past"
        ? pastEvents
        : savedEvents;

  function handleSavedChange(event, isSaved) {
    const updated = savedEvents.filter(
      (item) => String(getEventId(item)) !== String(getEventId(event)),
    );

    if (isSaved) {
      updated.push(event);
    }

    setSavedEvents(updated);
    localStorage.setItem("savedEvents", JSON.stringify(updated));
  }

  return (
    <>
      <div className="mx-auto mt-7 max-w-6xl px-6">
        <h1 className="text-3xl font-bold text-black-primary dark:text-white">
          My Events
        </h1>

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

      <section className="min-h-screen bg-white-secondary py-6 dark:bg-zinc-900">
        <div className="mx-auto max-w-6xl px-6">
          {loading && activeTab !== "saved" ? (
            <p>Loading events...</p>
          ) : error && activeTab !== "saved" ? (
            <div>
              <p className="text-red-600">{error}</p>

              <button
                type="button"
                onClick={() => dispatch(fetchJoinedEvents())}
                className="mt-2 text-orange-primary underline"
              >
                Try Again
              </button>
            </div>
          ) : visibleEvents.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {visibleEvents.map((event) => (
                <EventCard
                  key={getEventId(event)}
                  event={event}
                  onEventClick={(id) => navigate(`/event/${id}`)}
                  onSavedChange={handleSavedChange}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-secondary">
              {activeTab === "saved"
                ? "No saved events yet."
                : "No events found."}
            </p>
          )}
        </div>
      </section>
    </>
  );
}

export default MyEvents;
