import { useEffect, useState } from "react";
import CommunityHero from "../../components/CommunityHero";
import CommunityFilter from "../../components/CommunityFilter";
import CommunityList from "../../components/CommunityList";
import ModalSign from "../../components/ModalSign";
import { getCommunities } from "../../services/communityService";
import { joinCommunity, leaveCommunity } from "../../services/communityService";

function Communities() {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");

  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getCommunities(
          search,
          selectedCategory,
          controller.signal,
        );

        if (!controller.signal.aborted) {
          setCommunities(data);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [search, selectedCategory]);

  const communityCards = communities.map((community) => ({
    id: community.community_id,
    name: community.name,
    description: community.description || "",
    image: community.banner_url || "/C-Image(BandungGoCommunity).svg",
    category: community.categories?.join(", ") || "—",
    members: community.member_count ?? 0,
    upcomingEvents: community.upcoming_count ?? 0,
    isJoined: community.is_joined === true,
  }));

  function handleJoin() {
    if (!localStorage.getItem("token")) {
      setShowModal(true);
    }
  }

  async function handleJoinChange(community) {
    try {
      if (community.isJoined) {
        await leaveCommunity(community.id);
      } else {
        await joinCommunity(community.id);
      }
    } catch (error) {
      if (!error.message?.includes("already joined community")) {
        throw error;
      }
    }

    const latest = await getCommunities(search, selectedCategory);
    setCommunities(latest);
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

      <div className="px-3 md:px-6 lg:px-12">
        <p className="text-sm font-bold md:text-base">
          {communityCards.length}{" "}
          <span className="font-medium text-gray-primary/40">Communities</span>
        </p>
      </div>

      {selectedLocation !== "All Locations" && (
        <p className="px-6 text-sm text-orange-primary">
          Filter lokasi belum tersedia.
        </p>
      )}

      <div className="px-12">
        {loading ? (
          <p className="py-10 text-center">Loading communities...</p>
        ) : error ? (
          <p className="py-10 text-center text-red-500">{error}</p>
        ) : communityCards.length === 0 ? (
          <p className="py-10 text-center">No communities found.</p>
        ) : (
          <CommunityList
            communities={communityCards}
            onAuthRequired={handleJoin}
            onJoinChange={handleJoinChange}
          />
        )}
      </div>

      {showModal && <ModalSign onClose={() => setShowModal(false)} />}
    </>
  );
}

export default Communities;
