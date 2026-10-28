import { useEffect, useState } from "react";
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

import {
  fetchSavedEvents,
  selectSavedEvents,
  selectSavedLoading,
  selectSavedError,
} from "../../redux/slice/savedEventSlice";

function getEventId(event) {
  return event.event_id ?? event.id;
}

function MyEvents() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState(() => {
    const tab = sessionStorage.getItem("myEventsTab");
    return ["upcoming", "past", "saved"].includes(tab) ? tab : "upcoming";
  });

  const joinedEvents = useSelector(selectJoinedEvents) || [];
  const loading = useSelector(selectMemberLoading);
  const error = useSelector(selectMemberError);

  const savedEvents = useSelector(selectSavedEvents) || [];
  const savedLoading = useSelector(selectSavedLoading);
  const savedError = useSelector(selectSavedError);

  useEffect(() => {
    sessionStorage.setItem("myEventsTab", activeTab);

    if (activeTab === "saved") {
      dispatch(fetchSavedEvents());
    }
  }, [activeTab, dispatch]);

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

  const currentLoading = activeTab === "saved" ? savedLoading : loading;

  const currentError = activeTab === "saved" ? savedError : error;

  function handleRetry() {
    dispatch(activeTab === "saved" ? fetchSavedEvents() : fetchJoinedEvents());
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
          {currentLoading ? (
            <p>
              {activeTab === "saved"
                ? "Loading saved events..."
                : "Loading events..."}
            </p>
          ) : currentError ? (
            <div>
              <p className="text-red-600">{currentError}</p>

              <button
                type="button"
                onClick={handleRetry}
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
                  isRegistered={joinedEvents.some(
                    (item) =>
                      String(getEventId(item)) === String(getEventId(event)),
                  )}
                  onEventClick={(id) => navigate(`/event/${id}`)}
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
