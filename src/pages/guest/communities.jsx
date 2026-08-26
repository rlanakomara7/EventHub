import CommunityHero from "../../components/CommunityHero";
import CommunityFilter from "../../components/CommunityFilter";
import CommunityList from "../../components/CommunityList";
import communities from "../../data/communities.json";
import ModalSign from "../../components/ModalSign";
import { useState } from "react";

function Communities() {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  // state untuk category
  const [selectedCategory, setSelectedCategory] = useState("All");

  // state untuk location
  const [selectedLocation, setSelectedLocation] = useState("All Locations");

  // Filter community
  const communitiesFiltered = communities.filter((community) => {
    const keyword = search.toLowerCase();

    // FILTER SEARCH
    const matchSearch =
      community.name.toLowerCase().includes(keyword) ||
      community.description.toLowerCase().includes(keyword) ||
      community.category.toLowerCase().includes(keyword);

    // FILTER CATEGORY
    const matchCategory =
      selectedCategory === "All" || community.category === selectedCategory;

    const matchLocation =
      selectedLocation === "All Locations" ||
      community.location === selectedLocation;

    return matchSearch && matchCategory && matchLocation;
  });

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  function handleJoin() {
    if (!currentUser) {
      setShowModal(true);
      return;
    }
  }

  return (
    <>
      <CommunityHero search={search} setSearch={setSearch} />

      <CommunityFilter
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
      />

      <div className="px-3 md:px-6 lg:px-10">
        <p className="text-sm font-bold md:text-base">
          {communitiesFiltered.length}{" "}
          <span className="font-medium text-gray-primary/40">Communities</span>
        </p>
      </div>

      <CommunityList
        communities={communitiesFiltered}
        onAuthRequired={handleJoin}
      />

      {showModal && <ModalSign onClose={() => setShowModal(false)} />}
    </>
  );
}

export default Communities;
