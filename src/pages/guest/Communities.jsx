import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import CommunityHero from "../../components/CommunityHero";
import CommunityFilter from "../../components/CommunityFilter";
import CommunityList from "../../components/CommunityList";
import ModalSign from "../../components/ModalSign";

import { getCommunities } from "../../services/communityService";

function Communities() {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Status join terbaru dari Redux.
  const membershipById = useSelector((state) => state.communityMember.byId);

  // Ambil komunitas berdasarkan pencarian dan kategori.
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
        if (!controller.signal.aborted) {
          setError(err.message || "Failed to load communities.");
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

  // Filter status keanggotaan.
  const filteredCommunities = useMemo(() => {
    return communities.filter((community) => {
      const id = String(community.community_id ?? community.id);

      const joined = membershipById[id] ?? community.is_joined === true;

      if (selectedStatus === "Joined") {
        return joined;
      }

      if (selectedStatus === "Not Joined") {
        return !joined;
      }

      return true;
    });
  }, [communities, selectedStatus, membershipById]);

  function handleAuthRequired() {
    setShowModal(true);
  }

  return (
    <>
      <CommunityHero search={search} setSearch={setSearch} />

      <CommunityFilter
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <div className="px-6">
        <p className="text-sm font-bold md:text-base">
          {loading ? 0 : filteredCommunities.length}{" "}
          <span className="font-medium text-gray-primary/40">communities</span>
        </p>
      </div>

      <div className="px-6">
        {loading ? (
          <p className="py-10 text-center">Loading communities...</p>
        ) : error ? (
          <p className="py-10 text-center text-red-500">{error}</p>
        ) : filteredCommunities.length === 0 ? (
          <p className="py-10 text-center">No communities found.</p>
        ) : (
          <CommunityList
            communities={filteredCommunities}
            onAuthRequired={handleAuthRequired}
          />
        )}
      </div>

      {showModal && <ModalSign onClose={() => setShowModal(false)} />}
    </>
  );
}

export default Communities;
