import Header from "../../components/Header";
import SearchBar from "../../components/SearchBar";
import EventList from "../../components/EventList";
import events from "../../data/events.json";
import ModalSign from "../../components/ModalSign";
import { useState } from "react";

function Event() {
  //filter category
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
  // ----------------
  const [showModal, setShowModal] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  //handle join if blm login
  function handleJoin() {
    if (!currentUser) {
      setShowModal(true);
      return;
    }
  }

  return (
    <>
      <Header />
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
      <EventList events={eventsFiltered} onAuthRequired={handleJoin} />

      {showModal && <ModalSign onClose={() => setShowModal(false)} />}
    </>
  );
}

export default Event;
