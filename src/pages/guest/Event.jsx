import { useOutletContext } from "react-router";
import { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar";
import EventList from "../../components/EventList";
import { getEvents } from "../../utils/eventStorage";

function Event() {
  const { handleEventClick, handleJoin } = useOutletContext();

  const [selectedCategory, setSelectedCategory] = useState("All");

  // search filter
  const [search, setSearch] = useState("");

  // Ambil data dari localStorage lewat getEvents()
  const [events, setEvents] = useState(() => getEvents());

  useEffect(() => {
    setEvents(getEvents());
  }, []);

  const eventsFiltered = events.filter((event) => {
    const keyword = search.toLowerCase();

    const matchSearch =
      event.title?.toLowerCase().includes(keyword) ||
      event.category?.toLowerCase().includes(keyword) ||
      event.location?.toLowerCase().includes(keyword);

    // CATEGORY
    const matchCategory =
      selectedCategory === "All" || event.category === selectedCategory;

    // harus lolos search DAN category
    return matchSearch && matchCategory;
  });

  return (
    <>
      <SearchBar
        search={search}
        setSearch={setSearch}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <div className="px-14">
        <div className="px-1 py-5">
          <p className="font-bold text-lg">
            {eventsFiltered.length}{" "}
            <span className="text-gray-primary/40 font-medium">
              {" "}
              events found{" "}
            </span>
          </p>
        </div>
        <EventList
          events={eventsFiltered}
          onAuthRequired={handleJoin}
          onEventClick={handleEventClick}
        />
        <div className="flex justify-center mt-6 mb-6">
          <button
            type="button"
            className="rounded-xl border border-gray-secondary/40 px-6 py-2 text-slate-600 font-semibold"
          >
            Load more events
          </button>
        </div>
      </div>
    </>
  );
}

export default Event;
