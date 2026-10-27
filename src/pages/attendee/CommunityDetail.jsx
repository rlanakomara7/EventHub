import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { MdPeopleAlt } from "react-icons/md";
import { FiCalendar, FiMapPin, FiSend } from "react-icons/fi";

import EventCard from "../../components/EventCard";
import { getCommunities } from "../../services/communityService";
import {
  getExploreEvents,
  getExploreCommunities,
  resolveMediaUrl,
} from "../../services/exploreService";
import CommunityMembers from "../../components/CommunityMembers";

const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

function getCommunityId(community) {
  return community?.community_id ?? community?.id;
}

function getEventCommunityId(event) {
  return (
    event?.community_id ??
    event?.community?.community_id ??
    event?.community?.id
  );
}

function normalizeCommunity(item) {
  const categories = Array.isArray(item.categories)
    ? item.categories
    : item.category
      ? [item.category]
      : [];

  return {
    ...item,
    community_id: getCommunityId(item),
    banner_url: resolveMediaUrl(item.banner_url || item.image || ""),
    categories,
    member_count:
      item.member_count ??
      (typeof item.members === "number" ? item.members : 0),
  };
}

function CommunityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [memberCountFromApi, setMemberCountFromApi] = useState(null);
  const [community, setCommunity] = useState(null);
  const [communityEvents, setCommunityEvents] = useState([]);

  const [activeTab, setActiveTab] = useState("Events");

  const [loading, setLoading] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const [error, setError] = useState("");
  const [eventsError, setEventsError] = useState("");
  const [actionError, setActionError] = useState("");

  const [joined, setJoined] = useState(false);
  const [joining, setJoining] = useState(false);
  const [memberDelta, setMemberDelta] = useState(0);
  const [bannerFailed, setBannerFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCommunityDetail() {
      let communityLoaded = false;
      try {
        let communities;

        try {
          communities = await getExploreCommunities(controller.signal);
        } catch {
          communities = await getCommunities("", "", controller.signal);
        }

        if (controller.signal.aborted) return;

        if (!Array.isArray(communities)) {
          throw new Error("Invalid community response.");
        }

        const selected = communities
          .map(normalizeCommunity)
          .find((item) => String(item.community_id) === String(id));

        if (!selected) {
          throw new Error(
            "Community not found. Check the community ID in the URL.",
          );
        }

        setCommunity(selected);
        communityLoaded = true;
        setJoined(selected.is_joined === true);
        setMemberDelta(0);
        setLoading(false);

        const events = await getExploreEvents();

        if (controller.signal.aborted) return;

        const checkedEvents = await Promise.all(
          events.map(async (event) => {
            if (event.community_id !== undefined) {
              return event;
            }

            const eventId = event.event_id ?? event.id;

            if (!eventId) return null;

            try {
              const response = await fetch(`${API_URL}/api/events/${eventId}`, {
                signal: controller.signal,
              });

              if (!response.ok) return null;

              const result = await response.json();

              const detail =
                result.data?.event ?? result.data ?? result.event ?? result;

              return {
                ...event,
                community_id: getEventCommunityId(detail) ?? null,
              };
            } catch {
              return null;
            }
          }),
        );

        if (controller.signal.aborted) return;

        const today = new Date().toLocaleDateString("en-CA", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });

        const relatedEvents = checkedEvents
          .filter(Boolean)
          .filter(
            (event) =>
              String(getEventCommunityId(event)) ===
              String(selected.community_id),
          )
          .filter(
            (event) => String(event.event_date || "").slice(0, 10) >= today,
          )
          .sort((a, b) =>
            String(a.event_date || "").localeCompare(
              String(b.event_date || ""),
            ),
          );

        setCommunityEvents(relatedEvents);
      } catch (err) {
        if (controller.signal.aborted) return;

        if (!communityLoaded) {
          setError(err.message || "Failed to load community.");
        } else {
          setEventsError(err.message || "Failed to load events.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
          setLoadingEvents(false);
        }
      }
    }

    // Reset dilakukan saat ID komunitas berubah
    loadCommunityDetail();

    return () => controller.abort();
  }, [id]);

  async function handleCommunityMembership() {
    if (!community || joining) return;

    const token = localStorage.getItem("token");

    if (!token) {
      setActionError("Please login to join this community.");
      return;
    }

    const communityId = getCommunityId(community);
    const wasJoined = joined;

    setJoining(true);
    setActionError("");

    try {
      const response = await fetch(
        `${API_URL}/api/communities/${communityId}/${
          wasJoined ? "leave" : "join"
        }`,
        {
          method: wasJoined ? "DELETE" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message =
          result.message || "Failed to update community membership.";

        if (!wasJoined && /already/i.test(message)) {
          setJoined(true);
          return;
        }

        throw new Error(message);
      }

      setJoined(!wasJoined);

      setMemberDelta((previous) => previous + (wasJoined ? -1 : 1));
    } catch (err) {
      setActionError(err.message || "Failed to update community membership.");
    } finally {
      setJoining(false);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-14">
        <p className="text-sm text-gray-secondary">Loading community...</p>
      </main>
    );
  }

  if (error || !community) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-14">
        <h1 className="text-2xl font-bold">{error || "Community not found"}</h1>

        <Link
          to="/communities"
          className="mt-3 inline-block text-orange-primary"
        >
          ← Back to Communities
        </Link>
      </main>
    );
  }

  const bannerUrl = community.banner_url;

  const memberCount = Math.max(
    0,
    memberCountFromApi ?? Number(community.member_count || 0) + memberDelta,
  );

  const upcomingCount = loadingEvents
    ? (community.upcoming_count ?? "—")
    : communityEvents.length;

  const categories = community.categories
    .map((category) =>
      typeof category === "string"
        ? category
        : (category.category_name ?? category.name),
    )
    .filter(Boolean);

  const discussions = Array.isArray(community.discussions)
    ? community.discussions
    : [];

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-zinc-950">
      {/* BACK */}
      <div className="border-b border-gray-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900 md:px-10">
        <Link
          to="/communities"
          className="text-xs text-gray-secondary hover:text-orange-primary"
        >
          ← Back to Communities
        </Link>
      </div>

      {/* HERO / BANNER */}
      <section className="relative h-52 w-full overflow-hidden bg-gray-200 sm:h-60 md:h-72">
        {bannerUrl && !bannerFailed ? (
          <img
            src={bannerUrl}
            alt={community.name}
            className="absolute inset-0 h-full w-full object-cover"
            onError={() => setBannerFailed(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-slate-700" />
        )}

        {/* Overlay agar tulisan selalu terbaca */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-5 pb-5 sm:flex-row sm:items-end sm:justify-between md:px-6">
            <div className="min-w-0 text-white">
              <h1 className="text-xl font-bold leading-tight md:text-3xl">
                {community.name}
              </h1>

              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-white/90">
                <span className="flex items-center gap-1.5">
                  <MdPeopleAlt />
                  {memberCount.toLocaleString("id-ID")} members
                </span>

                <span className="flex items-center gap-1.5">
                  <FiCalendar />
                  {upcomingCount} upcoming events
                </span>

                {community.location && (
                  <span className="flex items-center gap-1.5">
                    <FiMapPin />
                    {community.location}
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleCommunityMembership}
              disabled={joining}
              className={`w-fit shrink-0 rounded-lg px-5 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 ${
                joined ? "bg-green-primary" : "bg-orange-primary"
              }`}
            >
              {joining
                ? "Processing..."
                : joined
                  ? "✓ Joined"
                  : "+ Join Community"}
            </button>
          </div>
        </div>
      </section>

      {/* DESCRIPTION */}
      <div className="mx-auto max-w-6xl px-4 pt-5 md:px-6">
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm leading-6 text-gray-secondary">
            {community.description || "No community description available."}
          </p>

          {categories.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((category) => (
                <span
                  key={category}
                  className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-600"
                >
                  {category}
                </span>
              ))}
            </div>
          )}

          {actionError && (
            <p role="alert" className="mt-3 text-xs text-red-600">
              {actionError}
            </p>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <main className="mx-auto w-full max-w-6xl px-4 pb-12 pt-5 md:px-6">
        {/* TABS */}
        <div className="border-b border-gray-200 dark:border-zinc-800">
          <div className="flex gap-7">
            {["Events", "Members", "Discussion"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`border-b-2 px-1 py-3 text-sm transition-colors ${
                  activeTab === tab
                    ? "border-orange-primary font-medium text-orange-primary"
                    : "border-transparent text-gray-secondary hover:text-orange-primary"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* EVENTS */}
        {activeTab === "Events" && (
          <section className="mt-6">
            <h2 className="mb-4 text-xs font-semibold tracking-wide text-gray-secondary">
              UPCOMING EVENTS
            </h2>

            {loadingEvents && (
              <p className="py-8 text-sm text-gray-secondary">
                Loading community events...
              </p>
            )}

            {eventsError && (
              <p role="alert" className="mb-4 text-sm text-red-600">
                {eventsError}
              </p>
            )}

            {!loadingEvents && !eventsError && communityEvents.length === 0 && (
              <div className="rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-sm text-gray-secondary">
                  No upcoming events in this community.
                </p>
              </div>
            )}

            {!loadingEvents && !eventsError && (
              <div className="grid w-full min-w-0 grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {communityEvents.map((event) => (
                  <div key={event.event_id} className="min-w-0">
                    <EventCard
                      event={event}
                      onEventClick={(eventId) => navigate(`/event/${eventId}`)}
                      onAuthRequired={() =>
                        setActionError("Please login to join events.")
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* MEMBERS */}
        {activeTab === "Members" && (
          <section className="mt-6">
            <CommunityMembers
              key={`${id}-${joined}`}
              communityId={id}
              onCountChange={setMemberCountFromApi}
            />
          </section>
        )}

        {/* DISCUSSION */}
        {activeTab === "Discussion" && (
          <section className="mt-6">
            {/* Bentuk input mengikuti referensi,
                tetapi tidak membuat komentar palsu */}
            <div className="flex items-center gap-3">
              <img
                src="/Default-Avatar.svg"
                alt=""
                className="h-9 w-9 shrink-0 rounded-full object-cover"
              />

              <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-900">
                <input
                  type="text"
                  disabled
                  placeholder="Community discussions will be available soon..."
                  className="min-w-0 flex-1 bg-transparent py-3 text-sm text-gray-secondary outline-none"
                />

                <button
                  type="button"
                  disabled
                  aria-label="Send discussion"
                  className="shrink-0 text-orange-primary opacity-40"
                >
                  <FiSend />
                </button>
              </div>
            </div>

            {discussions.length === 0 ? (
              <div className="mt-5 rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-sm text-gray-secondary">
                  No community discussions yet.
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                {discussions.map((item, index) => (
                  <div
                    key={item.discussion_id ?? item.id ?? index}
                    className="flex items-start gap-3"
                  >
                    <img
                      src={resolveMediaUrl(
                        item.avatar_url || "/Default-Avatar.svg",
                      )}
                      alt=""
                      className="h-9 w-9 shrink-0 rounded-full object-cover"
                    />

                    <div className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold">
                          {item.name || item.user || "Member"}
                        </span>

                        <span className="text-xs text-gray-secondary">
                          {item.created_at || item.time || ""}
                        </span>
                      </div>

                      <p className="mt-1 break-words text-sm leading-6 text-gray-secondary">
                        {item.message || item.text || ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default CommunityDetail;
