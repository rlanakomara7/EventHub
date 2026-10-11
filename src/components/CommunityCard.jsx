import { MdPeopleAlt } from "react-icons/md";
import { FiCalendar } from "react-icons/fi";
import { FaBookmark } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router";

function CommunityCard({
  community,
  onAuthRequired,
  onJoinChange,
  onSavedChange,
}) {
  const navigate = useNavigate();

  const communityId = community.id ?? community.community_id;

  const joined = community.isJoined === true || community.is_joined === true;

  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState("");

  function getSavedCommunities() {
    try {
      const data = JSON.parse(localStorage.getItem("savedCommunities") || "[]");

      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  const [saved, setSaved] = useState(() => {
    return getSavedCommunities().some(
      (item) => String(item.id ?? item.community_id) === String(communityId),
    );
  });

  const image =
    community.image ||
    community.banner_url ||
    "/C-Image(BandungGoCommunity).svg";

  const category =
    community.category ||
    (Array.isArray(community.categories)
      ? community.categories.join(", ")
      : "—");

  const members = Number(community.members ?? community.member_count ?? 0);

  const upcomingEvents = Number(
    community.upcomingEvents ?? community.upcoming_count ?? 0,
  );

  async function handleJoin() {
    const token = localStorage.getItem("token");

    if (!token) {
      onAuthRequired?.(community);
      return;
    }

    if (joining) return;

    setJoining(true);
    setJoinError("");

    try {
      await onJoinChange(community);
    } catch (error) {
      setJoinError(error.message || "Failed to update community membership");
    } finally {
      setJoining(false);
    }
  }

  function handleSave(event) {
    event.stopPropagation();

    const token = localStorage.getItem("token");

    if (!token) {
      onAuthRequired?.(community);
      return;
    }

    const savedCommunities = getSavedCommunities();

    const alreadySaved = savedCommunities.some(
      (item) => String(item.id ?? item.community_id) === String(communityId),
    );

    const nextSaved = !alreadySaved;

    const updatedCommunities = alreadySaved
      ? savedCommunities.filter(
          (item) =>
            String(item.id ?? item.community_id) !== String(communityId),
        )
      : [...savedCommunities, { ...community, id: communityId }];

    localStorage.setItem(
      "savedCommunities",
      JSON.stringify(updatedCommunities),
    );

    setSaved(nextSaved);
    onSavedChange?.(community, nextSaved);
  }

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white">
      <div
        className="h-44 w-full cursor-pointer overflow-hidden"
        onClick={() => navigate(`/communities/${communityId}`)}
      >
        <img
          src={image}
          alt={community.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col space-y-3 px-4 py-4">
        <h3
          className="cursor-pointer text-lg font-semibold text-gray-900 dark:text-white"
          onClick={() => navigate(`/communities/${communityId}`)}
        >
          {community.name}
        </h3>

        <p className="h-10 line-clamp-2 text-sm leading-5 text-gray-secondary">
          {community.description}
        </p>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-500">
            {category}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-secondary">
          <div className="flex items-center gap-1">
            <MdPeopleAlt />
            <span>{members.toLocaleString("id-ID")} members</span>
          </div>

          <div className="flex items-center gap-1">
            <FiCalendar />
            <span>{upcomingEvents} upcoming</span>
          </div>
        </div>

        <div className="mt-auto flex items-center gap-2">
          <button
            type="button"
            onClick={handleJoin}
            disabled={joining}
            className={`flex-1 rounded-lg py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 ${
              joined ? "bg-green-600 hover:bg-green-700" : "bg-orange-primary"
            }`}
          >
            {joining ? "Processing..." : joined ? "Joined" : "Join Community"}
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg border border-gray-200 px-3 py-2"
            aria-label={saved ? "Unsave community" : "Save community"}
          >
            <FaBookmark
              className={saved ? "text-orange-primary" : "text-gray-400"}
            />
          </button>
        </div>
      </div>

      {joinError && (
        <p role="alert" className="text-xs text-red-500">
          {joinError}
        </p>
      )}
    </article>
  );
}

export default CommunityCard;
