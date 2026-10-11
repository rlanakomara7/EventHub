import { useOutletContext } from "react-router";
import { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar";
import EventList from "../../components/EventList";
import { getEvents } from "../../services/eventsService";

function Event() {
  const { handleEventClick, handleJoin } = useOutletContext();

  const [selectedCategory, setSelectedCategory] = useState("All");

  // search filter
  const [search, setSearch] = useState("");

  // Ambil data dari localStorage lewat getEvents()
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, serError] = useState("");

  //connect database
  useEffect(() => {
    async function fetchEvents() {
      try {
        const result = await getEvents();
        console.log("GET EVENTS:", result);
        setEvents(result.data || []);
      } catch (error) {
        console.error(error.message);
        serError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const eventsFiltered = events.filter((event) => {
    const keyword = search.toLowerCase();

    const matchSearch =
      event.title?.toLowerCase().includes(keyword) ||
      event.location?.toLowerCase().includes(keyword) ||
      event.categories?.some((category) =>
        category.toLowerCase().includes(keyword),
      );

    // CATEGORY
    const matchCategory =
      selectedCategory === "All" ||
      event.categories?.includes(selectedCategory);

    // harus lolos search & category
    return matchSearch && matchCategory;
  });

  //handle loading and error
  if (loading) {
    return <div className="py-10 text-center">Loading Events...</div>;
  }

  if (error) {
    return <div className="py-10 text-center">{error}</div>;
  }
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
