import { useOutletContext } from "react-router";
import { useState } from "react";
import SearchBar from "../../components/SearchBar";
import EventList from "../../components/EventList";
import events from "../../data/events.json";

function Event() {
  const { currentUser, handleEventClick, handleJoin } = useOutletContext();

  const [selectedCategory, setSelectedCategory] = useState("All");

  // search filter
  const [search, setSearch] = useState("");

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
      <div className="px-10">
        <p className="font-bold">
          {eventsFiltered.length}{" "}
          <span className="text-gray-primary/40 font-medium"> Event Found</span>
        </p>
      </div>
      <EventList
        events={eventsFiltered}
        onAuthRequired={handleJoin}
        onEventClick={handleEventClick}
      />
    </>
  );
}

export default Event;
