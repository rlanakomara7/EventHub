import EventList from "../../components/EventList";
import events from "../../data/events.json";
import communities from "../../data/communities.json";
import reviews from "../../data/reviews.json";
import Hero from "../../components/Hero";
import CommunityList from "../../components/CommunityList";
import ReviewList from "../../components/ReviewList";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/slice/authSlice";
import { useOutletContext } from "react-router";
import Footer from "../../components/Footer";

function Explore() {
  const { handleJoin, handleEventClick } = useOutletContext();

  const user = useSelector(selectUser);

  const role = user?.role;

  console.log("USER:", user);
  console.log("ROLE:", role);

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
      <main className="mx-auto w-full px-14">
        <div>
          <div className="flex justify-between items-center">
            {role === "attendee" ? (
              <div className="mb-6">
                <p className="mb-1 flex items-center gap-2 text-sm font-semibold uppercase text-orange-primary">
                  ↗ Recommended For You
                </p>
                <p className="text-lg font-bold md:text-2xl">
                  Because you joined{" "}
                  <span className="text-orange-primary">
                    Bandung Go Community
                  </span>
                </p>
              </div>
            ) : (
              <p className="px-1 text-lg font-bold md:text-2xl mb-4">
                Discover events that interest you
              </p>
            )}

            <button className="text-slate-400">See all → </button>
          </div>

          <EventList
            events={eventsFiltered}
            onAuthRequired={handleJoin}
            onEventClick={handleEventClick}
          />
        </div>
        <div className="pt-17">
          <div className="flex justify-between items-center">
            <p className="px-1 font-bold text-2xl ">Popular Communities</p>
            <button className="text-slate-400">See all → </button>
          </div>
          <CommunityList
            communities={communities}
            onAuthRequired={handleJoin}
            events={eventsFiltered}
            onEventClick={handleEventClick}
          />
        </div>
        <div className="pt-10  ">
          <p className="px-1 mb-4 font-bold text-2xl">
            What the community says
          </p>
          <ReviewList reviews={reviews} />
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Explore;
