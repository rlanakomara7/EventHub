import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router";

import EventList from "../../components/EventList";
import CommunityList from "../../components/CommunityList";
import Hero from "../../components/Hero";
import Footer from "../../components/Footer";

import { selectUser } from "../../redux/slice/authSlice";

import {
  getExploreEvents,
  getExploreCommunities,
} from "../../services/exploreService";

function Explore() {
  const context = useOutletContext();
  const navigate = useNavigate();

  const handleJoin = context?.handleJoin;
  const handleEventClick = context?.handleEventClick;

  const user = useSelector(selectUser);
  const role = user?.role;

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [events, setEvents] = useState([]);
  const [communities, setCommunities] = useState([]);

  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingCommunities, setLoadingCommunities] = useState(true);

  const [eventsError, setEventsError] = useState("");
  const [communitiesError, setCommunitiesError] = useState("");

  useEffect(() => {
    let active = true;

    getExploreEvents()
      .then((data) => {
        if (active) {
          setEvents(data);
          setEventsError("");
        }
      })
      .catch((error) => {
        if (active) {
          setEventsError(error.message);
        }
      })
      .finally(() => {
        if (active) {
          setLoadingEvents(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    getExploreCommunities(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setCommunities(data);
          setCommunitiesError("");
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setCommunitiesError(error.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoadingCommunities(false);
        }
      });

    return () => controller.abort();
  }, []);

  const eventsFiltered = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return events.filter((event) => {
      const categories = event.categories || [];

      const matchSearch =
        event.title?.toLowerCase().includes(keyword) ||
        event.location?.toLowerCase().includes(keyword) ||
        categories.some((category) => category.toLowerCase().includes(keyword));

      const matchCategory =
        selectedCategory === "All" || categories.includes(selectedCategory);

      return matchSearch && matchCategory;
    });
  }, [events, search, selectedCategory]);

  return (
    <>
      <Hero
        search={search}
        setSearch={setSearch}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <main className="mx-auto w-full px-5 md:px-14">
        <section>
          <div className="flex items-center justify-between gap-4">
            {role === "attendee" ? (
              <div className="mb-6">
                <p className="mb-1 text-sm font-semibold uppercase text-orange-primary">
                  ↗ Discover Your Next Event
                </p>
                <p className="text-lg font-bold md:text-2xl">
                  Events you might be interested in
                </p>
              </div>
            ) : (
              <h2 className="mb-4 px-1 text-lg font-bold md:text-2xl">
                Discover events that interest you
              </h2>
            )}

            <button
              type="button"
              onClick={() => navigate("/event")}
              className="text-sm text-slate-400 hover:text-orange-primary"
            >
              See all →
            </button>
          </div>

          {loadingEvents && (
            <p className="py-8 text-center text-gray-secondary">
              Loading events...
            </p>
          )}

          {eventsError && !loadingEvents && (
            <p role="alert" className="py-6 text-red-600">
              {eventsError}
            </p>
          )}

          {!loadingEvents && !eventsError && eventsFiltered.length === 0 && (
            <p className="py-8 text-center text-gray-secondary">
              No events found.
            </p>
          )}

          {!loadingEvents && !eventsError && (
            <EventList
              events={eventsFiltered}
              onAuthRequired={handleJoin}
              onEventClick={(eventOrId) => {
                const eventId =
                  typeof eventOrId === "object"
                    ? (eventOrId?.event_id ?? eventOrId?.id)
                    : eventOrId;

                if (eventId == null) return;

                navigate(`/event/${eventId}`);
              }}
            />
          )}
        </section>

        <section className="pt-17">
          <div className="flex items-center justify-between">
            <h2 className="px-1 text-2xl font-bold">Popular Communities</h2>

            <button
              type="button"
              onClick={() => navigate("/communities")}
              className="text-sm text-slate-400 hover:text-orange-primary"
            >
              See all →
            </button>
          </div>

          {loadingCommunities && (
            <p className="py-8 text-center text-gray-secondary">
              Loading communities...
            </p>
          )}

          {communitiesError && !loadingCommunities && (
            <p role="alert" className="py-6 text-red-600">
              {communitiesError}
            </p>
          )}

          {!loadingCommunities &&
            !communitiesError &&
            communities.length === 0 && (
              <p className="py-8 text-center text-gray-secondary">
                No communities found.
              </p>
            )}

          {!loadingCommunities && !communitiesError && (
            <CommunityList
              communities={communities}
              onAuthRequired={handleJoin}
              events={eventsFiltered}
              onEventClick={handleEventClick}
            />
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Explore;
