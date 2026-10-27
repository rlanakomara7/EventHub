import { MdPeopleAlt } from "react-icons/md";
import { FiCalendar } from "react-icons/fi";
import { FaBookmark } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router";

const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

function resolveImage(path) {
  if (!path) {
    return "/C-Image(BandungGoCommunity).svg";
  }

  if (/^(https?:\/\/|data:)/i.test(path)) {
    return path;
  }

  return `${API_URL}/${String(path).replace(/^\/+/, "")}`;
}

function getSavedCommunities() {
  try {
    const data = JSON.parse(localStorage.getItem("savedCommunities") || "[]");

    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function CommunityCard({
  community,
  onAuthRequired,
  onSavedChange,
  onMembershipUpdated,
}) {
  const navigate = useNavigate();

  const communityId = community.community_id ?? community.id;

  // 🔄 UBAH: Tidak memakai setState di useEffect
  const [joinedOverride, setJoinedOverride] = useState(null);

  const joined =
    joinedOverride ??
    (community.is_joined === true || community.isJoined === true);

  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState("");

  const [memberDelta, setMemberDelta] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);

  const [saved, setSaved] = useState(() =>
    getSavedCommunities().some(
      (item) => String(item.community_id ?? item.id) === String(communityId),
    ),
  );

  const image = resolveImage(community.banner_url || community.image);

  const categories = Array.isArray(community.categories)
    ? community.categories
        .map((item) =>
          typeof item === "string" ? item : (item.category_name ?? item.name),
        )
        .filter(Boolean)
    : community.category
      ? [community.category]
      : [];

  const initialMembers = Number(
    community.member_count ?? community.members ?? 0,
  );

  const members = Math.max(
    0,
    (Number.isFinite(initialMembers) ? initialMembers : 0) + memberDelta,
  );

  const upcomingEvents = Number(
    community.upcoming_count ?? community.upcomingEvents ?? 0,
  );

  async function handleJoin() {
    if (joining || communityId == null) return;

    const token = localStorage.getItem("token");

    if (!token) {
      if (onAuthRequired) {
        onAuthRequired(community);
      } else {
        setJoinError("Please login first.");
      }
      return;
    }

    const wasJoined = joined;

    setJoining(true);
    setJoinError("");

    try {
      const endpoint = wasJoined ? "leave" : "join";

      const response = await fetch(
        `${API_URL}/api/communities/${communityId}/${endpoint}`,
        {
          method: wasJoined ? "DELETE" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message ||
            (wasJoined
              ? "Failed to leave community."
              : "Failed to join community."),
        );
      }
      const nextJoined = !wasJoined;

      setJoinedOverride(nextJoined);

      setMemberDelta((previous) => previous + (nextJoined ? 1 : -1));

      onMembershipUpdated?.(communityId, nextJoined);
    } catch (error) {
      setJoinError(error.message || "Failed to update community membership.");
    } finally {
      setJoining(false);
    }
  }

  function handleSave(event) {
    event.stopPropagation();

    if (!localStorage.getItem("token")) {
      onAuthRequired?.(community);
      return;
    }

    const savedCommunities = getSavedCommunities();

    const alreadySaved = savedCommunities.some(
      (item) => String(item.community_id ?? item.id) === String(communityId),
    );

    const updated = alreadySaved
      ? savedCommunities.filter(
          (item) =>
            String(item.community_id ?? item.id) !== String(communityId),
        )
      : [
          ...savedCommunities,
          {
            ...community,
            community_id: communityId,
          },
        ];

    try {
      localStorage.setItem("savedCommunities", JSON.stringify(updated));

      const nextSaved = !alreadySaved;

      setSaved(nextSaved);
      onSavedChange?.(community, nextSaved);
    } catch {
      setJoinError("Failed to save community in this browser.");
    }
  }

  return (
    <article className="flex h-full min-w-0 w-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white">
      {/* BANNER */}
      <button
        type="button"
        onClick={() => navigate(`/communities/${communityId}`)}
        className="block h-40 w-full shrink-0 overflow-hidden bg-gray-100"
        aria-label={`View ${community.name}`}
      >
        {!imageFailed ? (
          <img
            src={image}
            alt={community.name}
            className="block h-full w-full object-cover"
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
            No community image
          </div>
        )}
      </button>

      {/* BODY */}
      <div className="flex min-w-0 flex-1 flex-col p-4">
        {/* NAMA KOMUNITAS */}
        <button
          type="button"
          onClick={() => navigate(`/communities/${communityId}`)}
          className="text-left text-base font-semibold text-gray-900 hover:text-orange-primary dark:text-white"
        >
          {community.name}
        </button>

        {/* DESCRIPTION */}
        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-gray-secondary">
          {community.description}
        </p>

        {/* CATEGORY */}
        <div className="mt-3 flex min-h-6 flex-wrap gap-1.5">
          {categories.length > 0 ? (
            categories.map((category, index) => (
              <span
                key={`${category}-${index}`}
                className="rounded-full bg-blue-50 px-2.5 py-1 text-xs text-blue-500"
              >
                {category}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-secondary">No category</span>
          )}
        </div>

        {/* MEMBER COUNT */}
        <div className="mt-auto pt-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-secondary">
            <div className="flex items-center gap-1">
              <MdPeopleAlt />

              <span>{members.toLocaleString("id-ID")} members</span>
            </div>

            <div className="flex items-center gap-1">
              <FiCalendar />

              <span>{upcomingEvents} upcoming</span>
            </div>
          </div>

          {/* ERROR MESSAGE */}
          {joinError && (
            <p role="alert" className="mt-3 text-xs text-red-600">
              {joinError}
            </p>
          )}

          {/* JOIN / LEAVE */}
          <div className="mt-3 flex w-full items-center gap-2">
            <button
              type="button"
              onClick={handleJoin}
              disabled={joining || communityId == null}
              className={`flex h-9 min-w-0 flex-1 items-center justify-center rounded-lg px-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 ${
                joined ? "bg-green-600 hover:bg-green-700" : "bg-orange-primary"
              }`}
            >
              {joining
                ? "Processing..."
                : joined
                  ? "✓ Joined — Leave"
                  : "Join Community"}
            </button>

            {/* BOOKMARK */}
            <button
              type="button"
              onClick={handleSave}
              aria-label={saved ? "Unsave community" : "Save community"}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 dark:border-zinc-700"
            >
              <FaBookmark
                className={saved ? "text-orange-primary" : "text-gray-400"}
              />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default CommunityCard;
