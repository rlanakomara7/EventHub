import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import { GoPeople, GoPencil, GoTrash } from "react-icons/go";
import { FaArrowTrendUp, FaRegEye } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

import ChartDashboard from "../../components/ChartDashboard";
import { getMyEvents } from "../../services/eventsService";
import { deleteEvent } from "../../services/eventDeleteService";

function getAttendeeCount(event) {
  const value =
    event.attendee_count ??
    event.attendees_count ??
    event.total_attendees ??
    event.attendees;

  if (value === undefined || value === null) {
    return null;
  }

  const count = Number(value);

  return Number.isFinite(count) ? count : null;
}

function getBannerUrl(event) {
  const banner = event.banner_url || event.image || "";

  if (!banner) return "";

  if (
    banner.startsWith("http://") ||
    banner.startsWith("https://") ||
    banner.startsWith("data:")
  ) {
    return banner;
  }

  const baseUrl = (
    import.meta.env.VITE_API_URL || "http://localhost:8500"
  ).replace(/\/$/, "");

  return banner.startsWith("/")
    ? `${baseUrl}${banner}`
    : `${baseUrl}/${banner}`;
}

function Dashboard() {
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state.auth.user);

  const role = currentUser?.role;

  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //  Status hapus event
  const [deletingEventId, setDeletingEventId] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  //  Ambil event organizer dari backend
  useEffect(() => {
    if (role !== "organizer") return;

    const controller = new AbortController();

    getMyEvents(controller.signal)
      .then((events) => {
        if (!controller.signal.aborted) {
          setMyEvents(events);
          setError("");
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setError(err.message || "Failed to load your events.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [role]);

  // Delete Event melalui API
  async function handleDelete(eventId, eventTitle) {
    if (!eventId || deletingEventId !== null) return;

    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${eventTitle}"?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) return;

    setDeleteError("");
    setDeletingEventId(eventId);

    try {
      await deleteEvent(eventId);

      setMyEvents((previous) =>
        previous.filter(
          (event) => String(event.event_id ?? event.id) !== String(eventId),
        ),
      );
    } catch (err) {
      setDeleteError(err.message || "Failed to delete event.");
    } finally {
      setDeletingEventId(null);
    }
  }

  if (role !== "organizer") {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold">Access denied</h1>

        <p className="mt-2 text-gray-secondary">
          Halaman ini hanya dapat diakses oleh organizer.
        </p>
      </div>
    );
  }

  const attendeeCounts = myEvents.map(getAttendeeCount);

  const hasAttendeeData = attendeeCounts.every((count) => count !== null);

  const totalAttendees =
    myEvents.length === 0
      ? 0
      : hasAttendeeData
        ? attendeeCounts.reduce((sum, count) => sum + count, 0)
        : "—";

  const averageFillRate =
    myEvents.length === 0
      ? "0%"
      : hasAttendeeData && myEvents.every((event) => Number(event.capacity) > 0)
        ? `${Math.round(
            myEvents.reduce(
              (total, event) =>
                total +
                (getAttendeeCount(event) / Number(event.capacity)) * 100,
              0,
            ) / myEvents.length,
          )}%`
        : "—";

  const hasViewsData = myEvents.every(
    (event) =>
      event.views !== undefined &&
      event.views !== null &&
      Number.isFinite(Number(event.views)),
  );

  const totalViews =
    myEvents.length === 0
      ? 0
      : hasViewsData
        ? myEvents.reduce((sum, event) => sum + Number(event.views), 0)
        : "—";

  const total = [
    {
      title: "TOTAL EVENTS",
      count: myEvents.length,
      sub: "All time",
      logo: SlCalender,
    },
    {
      title: "TOTAL ATTENDEES",
      count: totalAttendees,
      sub: "Across all events",
      logo: GoPeople,
    },
    {
      title: "AVG FILL RATE",
      count: averageFillRate,
      sub: "Capacity utilization",
      logo: FaArrowTrendUp,
    },
    {
      title: "EVENT VIEWS",
      count: totalViews,
      sub: "All time",
      logo: FaRegEye,
    },
  ];

  return (
    <main className="mx-auto max-w-6xl p-6 md:p-10">
      <div className="flex flex-col justify-between gap-4 md:flex-row">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">
            Organizer Dashboard
          </h1>

          <p className="text-gray-secondary">
            Manage your events and track performance.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/dashboard/events/new")}
          className="flex w-fit items-center gap-2 rounded-lg bg-orange-primary px-4 py-2 text-white"
        >
          <FaPlus />
          Create Event
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {total.map((item) => {
          const Icon = item.logo;

          return (
            <div
              key={item.title}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex justify-between">
                <p className="text-xs font-medium text-gray-secondary">
                  {item.title}
                </p>

                <Icon className="text-gray-secondary" />
              </div>

              <p className="mt-4 text-2xl font-bold">
                {loading ? "..." : item.count}
              </p>

              <p className="text-xs text-gray-secondary">{item.sub}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-[7fr_3fr]">
        <section>
          <h2 className="mb-5 text-xl font-bold">Your Events</h2>

          {loading && (
            <p className="text-sm text-gray-secondary">
              Loading your events...
            </p>
          )}

          {error && !loading && (
            <div
              role="alert"
              className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600"
            >
              {error}
            </div>
          )}

          {/* Tampilkan error jika DELETE gagal */}
          {deleteError && (
            <div
              role="alert"
              className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600"
            >
              {deleteError}
            </div>
          )}

          <div className="space-y-4">
            {!loading && !error && myEvents.length === 0 && (
              <p className="text-sm text-gray-secondary">Belum ada event.</p>
            )}

            {!loading &&
              !error &&
              myEvents.map((event, index) => {
                const eventId = event.event_id ?? event.id;

                const attendees = getAttendeeCount(event);

                const capacity = Number(event.capacity) || 0;

                const percentage =
                  attendees !== null && capacity > 0
                    ? Math.round((attendees / capacity) * 100)
                    : null;

                const safePercentage =
                  percentage === null
                    ? 0
                    : Math.min(100, Math.max(0, percentage));

                const bannerUrl = getBannerUrl(event);
                const status = event.status || "Created";

                const isDeleting = deletingEventId === eventId;

                return (
                  <div
                    key={eventId ?? index}
                    className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4"
                  >
                    {bannerUrl ? (
                      <img
                        src={bannerUrl}
                        alt={event.title}
                        className="h-20 w-24 shrink-0 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-20 w-24 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                        No Image
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-3">
                        <div>
                          <h3 className="font-semibold">{event.title}</h3>

                          <p className="text-sm text-gray-secondary">
                            {String(event.event_date || "").slice(0, 10)}
                            {" · "}
                            {event.location || "-"}
                          </p>
                        </div>

                        <span className="h-fit rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                          {status}
                        </span>
                      </div>

                      <div className="mt-4 flex justify-between text-xs text-gray-secondary">
                        <span>
                          {attendees === null ? "—" : attendees} attendees
                        </span>

                        <span>{capacity} capacity</span>
                      </div>

                      <div className="mt-2 h-2 rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-green-500"
                          style={{
                            width: `${safePercentage}%`,
                          }}
                        />
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={eventId == null || deletingEventId !== null}
                          onClick={() =>
                            navigate(`/dashboard/events/${eventId}/edit`)
                          }
                          className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm hover:border-orange-primary disabled:opacity-50"
                        >
                          <GoPencil />
                          Edit
                        </button>

                        {/* ✅ TAMBAH: Tombol Delete */}
                        <button
                          type="button"
                          disabled={eventId == null || deletingEventId !== null}
                          onClick={() => handleDelete(eventId, event.title)}
                          className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <GoTrash />
                          {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </section>

        <aside>
          <ChartDashboard />

          <div className="mt-5 rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="font-semibold">Quick Actions</h3>

            <button
              type="button"
              onClick={() => navigate("/dashboard/events/new")}
              className="mt-4 w-full rounded-lg bg-orange-primary py-2 text-sm text-white"
            >
              + Create New Event
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default Dashboard;
