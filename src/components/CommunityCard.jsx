import { MdPeopleAlt } from "react-icons/md";
import { FiCalendar } from "react-icons/fi";
import { FaBookmark } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

function CommunityCard({
  community,
  onAuthRequired = () => {},
  onJoinChange = () => {},
  onSavedChange = () => {},
  isJoined = false,
  isSaved = false,
}) {
  const navigate = useNavigate();

  const [joined, setJoined] = useState(isJoined);
  const [saved, setSaved] = useState(isSaved);

  useEffect(() => {
    const joinedCommunities =
      JSON.parse(localStorage.getItem("joinedCommunities")) || [];

    const savedCommunities =
      JSON.parse(localStorage.getItem("savedCommunities")) || [];

    setJoined(
      joinedCommunities.some(
        (item) => String(item.id) === String(community.id),
      ),
    );

    setSaved(
      savedCommunities.some((item) => String(item.id) === String(community.id)),
    );
  }, [community.id, isJoined, isSaved]);

  function handleJoin() {
    const currentUser = localStorage.getItem("currentUser");

    if (!currentUser) {
      onAuthRequired(community);
      return;
    }

    const joinedCommunities =
      JSON.parse(localStorage.getItem("joinedCommunities")) || [];

    const alreadyJoined = joinedCommunities.some(
      (item) => String(item.id) === String(community.id),
    );

    const updatedCommunities = alreadyJoined
      ? joinedCommunities.filter(
          (item) => String(item.id) !== String(community.id),
        )
      : [...joinedCommunities, community];

    const nextJoined = !alreadyJoined;

    localStorage.setItem(
      "joinedCommunities",
      JSON.stringify(updatedCommunities),
    );

    setJoined(nextJoined);

    onJoinChange(community, nextJoined);
  }

  function handleSave(e) {
    e.stopPropagation();

    const currentUser = localStorage.getItem("currentUser");

    if (!currentUser) {
      onAuthRequired(community);
      return;
    }

    const savedCommunities =
      JSON.parse(localStorage.getItem("savedCommunities")) || [];

    const alreadySaved = savedCommunities.some(
      (item) => String(item.id) === String(community.id),
    );

    const updatedCommunities = alreadySaved
      ? savedCommunities.filter(
          (item) => String(item.id) !== String(community.id),
        )
      : [...savedCommunities, community];

    const nextSaved = !alreadySaved;

    localStorage.setItem(
      "savedCommunities",
      JSON.stringify(updatedCommunities),
    );

    setSaved(nextSaved);

    onSavedChange(community, nextSaved);
  }

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white">
      <div
        className="h-44 w-full cursor-pointer overflow-hidden"
        onClick={() => navigate(`/communities/${community.id}`)}
      >
        <img
          src={community.image}
          alt={community.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col space-y-3 px-4 py-4">
        <h3
          className="cursor-pointer text-lg font-semibold text-gray-900  dark:text-white"
          onClick={() => navigate(`/communities/${community.id}`)}
        >
          {community.name}
        </h3>

        <p className="h-10 line-clamp-2 text-sm leading-5 text-gray-secondary">
          {community.description}
        </p>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-500">
            {community.category}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-secondary">
          <div className="flex items-center gap-1">
            <MdPeopleAlt />
            <span>{community.members.toLocaleString("id-ID")} members</span>
          </div>

          <div className="flex items-center gap-1">
            <FiCalendar />
            <span>{community.upcomingEvents} upcoming</span>
          </div>
        </div>

        <div className="mt-auto flex items-center gap-2">
          <button
            type="button"
            onClick={handleJoin}
            className={`flex-1 rounded-lg py-2 text-sm font-medium text-white-secondary hover:cursor-pointer ${
              joined ? "bg-green-primary" : "bg-orange-primary"
            }`}
          >
            {joined ? "Joined" : "Join Community"}
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
    </article>
  );
}

export default CommunityCard;
