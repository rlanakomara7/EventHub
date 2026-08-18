import Header from "../../components/Header";
import EventList from "../../components/Eventlist";
import events from "../../data/events.json";
import communities from "../../data/communities.json";
import reviews from "../../data/reviews.json";
import Hero from "../../components/Hero";
import CommunityList from "../../components/CommunityList";
import ReviewList from "../../components/ReviewList";
import Footer from "../../components/Footer";
import { useState } from "react";
import ModalSign from "../../components/ModalSign";

function Explore() {
  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");

  const eventsFiltered = events.filter((event) => {
    const keyword = search.toLowerCase();

    const matchSearch =
      event.title?.toLowerCase().includes(keyword) ||
      event.category?.toLowerCase().includes(keyword) ||
      event.location?.toLowerCase().includes(keyword);

    // CATEGORY
    const matchCategory =
      selectedCategory === "All" || event.category === selectedCategory;

    return matchSearch && matchCategory;
  });

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
      <Header title="Explore" />
      <Hero
        search={search}
        setSearch={setSearch}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <main className="px-3 md:px-5">
        <div>
          <p className="px-1 text-lg font-bold md:px-5 md:text-2xl">
            Discover events that interest you
          </p>
          <EventList events={eventsFiltered} onAuthRequired={handleJoin} />
        </div>
        <div className="pt-10">
          <p className="px-5 font-bold text-2xl">Popular Communities</p>
          <CommunityList
            communities={communities}
            onAuthRequired={handleJoin}
            events={eventsFiltered}
          />
        </div>
        <div className="pt-10  ">
          <p className="px-5 font-bold text-2xl">What the community says</p>
          <ReviewList reviews={reviews} />
        </div>
      </main>
      <Footer />
      {showModal && <ModalSign onClose={() => setShowModal(false)} />}
    </>
  );
}

export default Explore;
