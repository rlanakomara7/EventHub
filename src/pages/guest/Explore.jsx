import EventList from "../../components/EventList";
import events from "../../data/events.json";
import communities from "../../data/communities.json";
import reviews from "../../data/reviews.json";
import Hero from "../../components/Hero";
import CommunityList from "../../components/CommunityList";
import ReviewList from "../../components/ReviewList";
import { useState } from "react";

import { useOutletContext } from "react-router";

function Explore() {
  const { handleJoin, handleEventClick } = useOutletContext();

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

  return (
    <>
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
          <EventList
            events={eventsFiltered}
            onAuthRequired={handleJoin}
            onEventClick={handleEventClick}
          />
        </div>
        <div className="pt-10">
          <p className="px-5 font-bold text-2xl">Popular Communities</p>
          <CommunityList
            communities={communities}
            onAuthRequired={handleJoin}
            events={eventsFiltered}
            onEventClick={handleEventClick}
          />
        </div>
        <div className="pt-10  ">
          <p className="px-5 font-bold text-2xl">What the community says</p>
          <ReviewList reviews={reviews} />
        </div>
      </main>
    </>
  );
}

export default Explore;
