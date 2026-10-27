import { Link, useParams } from "react-router";
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUsers,
  FiMessageCircle,
} from "react-icons/fi";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { selectUser } from "../../redux/slice/authSlice";

// Tidak lagi menggunakan events.json

const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

function resolveImageUrl(path) {
  if (!path) return "";

  if (/^(https?:\/\/|data:)/i.test(path)) {
    return path;
  }

  return `${API_URL}/${String(path).replace(/^\/+/, "")}`;
}

function formatDate(value) {
  if (!value) return "-";

  const date = String(value).slice(0, 10);
  const parts = date.split("-");

  if (parts.length !== 3) return date;

  const parsed = new Date(`${date}T12:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function EventDetail() {
  const { id } = useParams();
  const user = useSelector(selectUser);

  //  Data Event Detail dari PostgreSQL
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageFailed, setImageFailed] = useState(false);

  //  State pendaftaran melalui backend
  const [registered, setRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [registerError, setRegisterError] = useState("");

  const [shareMessage, setShareMessage] = useState("");

  //  GET /api/events/:id
  useEffect(() => {
    const controller = new AbortController();

    async function loadEvent() {
      setLoading(true);
      setError("");
      setImageFailed(false);
      setRegisterError("");
      setRegistered(false);
      setEvent(null);

      try {
        const response = await fetch(`${API_URL}/api/events/${id}`, {
          signal: controller.signal,
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Event not found.");
          }

          throw new Error(result.message || "Failed to load event.");
        }

        const data =
          result.data?.event ?? result.data ?? result.event ?? result;

        if (!data || !data.event_id) {
          throw new Error("Invalid event detail response.");
        }

        if (controller.signal.aborted) return;

        setEvent(data);

        // Jika suatu saat backend menyertakan status pendaftaran
        setRegistered(data.is_registered === true || data.is_joined === true);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message || "Failed to load event.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadEvent();

    return () => controller.abort();
  }, [id]);

  // Registrasi event melalui backend
  async function handleRegister() {
    if (!event || registering) return;

    const token = localStorage.getItem("token");

    if (!user || !token) {
      setRegisterError("Please login to join this event.");
      return;
    }

    setRegisterError("");
    setRegistering(true);

    try {
      const response = await fetch(
        `${API_URL}/api/events/${event.event_id}/${
          registered ? "leave" : "join"
        }`,
        {
          method: registered ? "DELETE" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message =
          result.message ||
          (registered ? "Failed to leave event." : "Failed to join event.");

        // Respons backend ketika user ternyata sudah terdaftar
        if (
          !registered &&
          /already.*(join|register|member)|already registered/i.test(message)
        ) {
          setRegistered(true);
          return;
        }

        throw new Error(message);
      }

      setRegistered((previous) => !previous);

      // Update angka peserta
      setEvent((previous) => {
        if (!previous) return previous;

        const count = Number(previous.registered ?? 0);
        const nextCount = registered ? Math.max(0, count - 1) : count + 1;

        return {
          ...previous,
          registered: nextCount,
          spots_left: Math.max(0, Number(previous.capacity ?? 0) - nextCount),
        };
      });
    } catch (err) {
      setRegisterError(err.message || "Failed to update registration.");
    } finally {
      setRegistering(false);
    }
  }

  async function handleShare() {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: event.title,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setShareMessage("Event link copied!");
      }
    } catch {
      setShareMessage("Unable to share event link.");
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-12">
        <p className="text-gray-secondary">Loading event details...</p>
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-2xl font-bold">{error || "Event not found"}</h1>

        <Link to="/event" className="mt-3 inline-block text-orange-primary">
          ← Back to Events
        </Link>
      </main>
    );
  }

  // API Event Detail
  const attendees = Number(event.registered ?? 0);
  const capacity = Number(event.capacity ?? 0);

  const percentage =
    capacity > 0
      ? Math.min(100, Math.max(0, Math.round((attendees / capacity) * 100)))
      : 0;

  const categories = Array.isArray(event.categories) ? event.categories : [];

  const speakers = Array.isArray(event.speakers) ? event.speakers : [];

  const discussions = Array.isArray(event.discussions) ? event.discussions : [];

  const bannerUrl = resolveImageUrl(event.banner_url);

  const isFull =
    event.availability === "full" || (capacity > 0 && attendees >= capacity);

  const isCompleted =
    event.availability === "completed" || event.status === "completed";

  const availabilityLabel = isCompleted
    ? "Completed"
    : isFull
      ? "Full"
      : "Available";

  const formattedTime = [
    String(event.start_time || "").slice(0, 5),
    String(event.end_time || "").slice(0, 5),
  ]
    .filter(Boolean)
    .join(" – ");

  return (
    <>
      {/* BACK */}
      <div className="border-b border-gray-200 px-4 py-4 md:px-10">
        <Link
          to="/event"
          className="text-sm text-gray-secondary hover:text-orange-primary"
        >
          ← Back to Events
        </Link>
      </div>

      {/* CONTENT */}
      <main className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* LEFT CONTENT */}
          <div className="min-w-0 lg:col-span-2">
            {/*  URL backend */}
            {bannerUrl && !imageFailed ? (
              <img
                src={bannerUrl}
                alt={event.title}
                onError={() => setImageFailed(true)}
                className="h-56 w-full rounded-xl object-cover md:h-96"
              />
            ) : (
              <div className="flex h-56 w-full items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-400 md:h-96">
                No event image
              </div>
            )}

            {/* CATEGORY */}
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((category, index) => {
                const categoryName =
                  typeof category === "string"
                    ? category
                    : category.category_name;

                return (
                  <span
                    key={`${categoryName}-${index}`}
                    className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-500"
                  >
                    {categoryName}
                  </span>
                );
              })}

              <span
                className={`rounded-full px-3 py-1 text-xs ${
                  isFull || isCompleted
                    ? "bg-gray-100 text-gray-500"
                    : "bg-green-50 text-green-600"
                }`}
              >
                {availabilityLabel}
              </span>
            </div>

            {/* TITLE */}
            <h1 className="mt-3 text-2xl font-bold md:text-3xl">
              {event.title}
            </h1>

            {/* ABOUT */}
            <section className="mt-6">
              <h2 className="font-semibold">About this event</h2>

              <p className="mt-3 whitespace-pre-line text-sm leading-6 text-gray-secondary">
                {event.description || "No description provided."}
              </p>
            </section>

            {/* SPEAKERS */}
            <section className="mt-7">
              <h2 className="font-semibold">Speakers</h2>

              {speakers.length > 0 ? (
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {speakers.map((speaker, index) => (
                    <div
                      key={speaker.speaker_id ?? index}
                      className="rounded-xl border border-gray-200 p-4"
                    >
                      <p className="font-semibold">
                        {typeof speaker === "string" ? speaker : speaker.name}
                      </p>

                      {speaker.job && (
                        <p className="text-xs text-gray-secondary">
                          {speaker.job}
                        </p>
                      )}

                      {speaker.company && (
                        <p className="text-xs text-gray-secondary">
                          {speaker.company}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-gray-secondary">
                  No speakers announced yet.
                </p>
              )}
            </section>

            {/* DISCUSSION */}
            <section className="mt-7">
              <h2 className="flex items-center gap-2 font-semibold">
                <FiMessageCircle />
                Discussion
                <span className="text-sm font-normal text-gray-secondary">
                  ({discussions.length})
                </span>
              </h2>

              {discussions.length > 0 ? (
                <div className="mt-3 space-y-3">
                  {discussions.map((item, index) => (
                    <div
                      key={item.discussion_id ?? index}
                      className="rounded-xl border border-gray-200 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium">
                          {item.name || "User"}
                        </p>

                        <span className="text-xs text-gray-secondary">
                          {item.created_at || ""}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-gray-secondary">
                        {item.message}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-gray-secondary">
                  No discussions yet.
                </p>
              )}

              <p className="mt-4 text-xs text-gray-secondary">
                Posting discussions will be available after the discussion API
                is connected.
              </p>
            </section>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="min-w-0">
            <div className="rounded-xl border border-gray-200 p-5">
              <p className="text-xs font-semibold text-gray-secondary">
                EVENT INFO
              </p>

              <div className="mt-4 space-y-3 text-sm text-gray-secondary">
                <div className="flex items-center gap-2">
                  <FiCalendar />
                  <span>{formatDate(event.event_date)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <FiClock />
                  <span>
                    {formattedTime || "-"}
                    {formattedTime && " WIB"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <FiMapPin />
                  <span>
                    {event.location || "-"}
                    {event.format === "online" && " (Online)"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <FiUsers />
                  <span>
                    {attendees} / {capacity}
                  </span>
                </div>
              </div>

              {/* CAPACITY */}
              <div className="mt-5">
                <div className="flex justify-between text-xs text-gray-secondary">
                  <span>{attendees} attendees</span>
                  <span>{capacity} capacity</span>
                </div>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full bg-green-500"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>
              </div>

              {/* Join/Leave via API */}
              <button
                type="button"
                onClick={handleRegister}
                disabled={
                  registering || (!registered && (isFull || isCompleted))
                }
                className={`mt-4 w-full rounded-lg py-2.5 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50 ${
                  registered ? "bg-green-primary" : "bg-orange-primary"
                }`}
              >
                {registering
                  ? "Processing..."
                  : registered
                    ? "Leave Event"
                    : isCompleted
                      ? "Event Completed"
                      : isFull
                        ? "Event Full"
                        : "Join Event"}
              </button>

              {registerError && (
                <p role="alert" className="mt-3 text-xs text-red-600">
                  {registerError}
                </p>
              )}

              {/* ACTION */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled
                  title="Save event API not connected yet"
                  className="rounded-lg border border-gray-200 py-2 text-sm opacity-50"
                >
                  Save
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="rounded-lg border border-gray-200 py-2 text-sm hover:border-orange-primary"
                >
                  Share
                </button>
              </div>

              {shareMessage && (
                <p className="mt-2 text-xs text-gray-secondary">
                  {shareMessage}
                </p>
              )}
            </div>

            {/* ORGANIZER */}
            <div className="mt-4 rounded-xl border border-gray-200 p-5">
              <p className="text-xs font-semibold text-gray-secondary">
                ORGANIZED BY
              </p>

              <div className="mt-4">
                <p className="font-semibold">
                  {event.organizer?.name || "Organizer"}
                </p>

                {event.community?.name && (
                  <p className="text-xs text-orange-primary">
                    {event.community.name}
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}

export default EventDetail;
