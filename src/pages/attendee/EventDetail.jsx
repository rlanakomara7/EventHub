import { Link, useParams } from "react-router";
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUsers,
  FiMessageCircle,
  FiSend,
} from "react-icons/fi";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/slice/authSlice";
import events from "../../data/events.json";

function EventDetail() {
  // id DARI URL
  const { id } = useParams();

  // CARI EVENT SESUAI ID
  const event = events.find((event) => String(event.id) === String(id));

  // komentar
  const user = useSelector(selectUser);

  const [comments, setComments] = useState(() => {
    const savedComments = JSON.parse(
      localStorage.getItem(`eventComments_${id}`),
    );

    return (
      savedComments || [
        {
          id: 1,
          author: "Dian Purnama",
          text: "Super excited for this event!",
          time: "2d ago",
        },
        {
          id: 2,
          author: "Ahmad Fauzan",
          text: "Bring your laptop and get ready for the workshop.",
          time: "1d ago",
        },
      ]
    );
  });
  const [comment, setComment] = useState("");

  function handleAddComment(e) {
    e.preventDefault();

    const trimmedComment = comment.trim();

    if (!trimmedComment) return;

    const newComment = {
      id: Date.now(),
      author: user?.name || "User",
      text: trimmedComment,
      time: "Just now",
    };

    const updatedComments = [...comments, newComment];

    setComments(updatedComments);
    setComment("");

    localStorage.setItem(
      `eventComments_${id}`,
      JSON.stringify(updatedComments),
    );
  }

  // ------------
  const [registered, setRegistered] = useState(() => {
    const registeredEvents =
      JSON.parse(localStorage.getItem("registeredEvents")) || [];

    return registeredEvents.some((item) => String(item.id) === String(id));
  });

  function handleRegister() {
    // Ambil data registered dari localStorage
    const registeredEvents =
      JSON.parse(localStorage.getItem("registeredEvents")) || [];

    // Cek apakah event sudah ada
    const alreadyRegistered = registeredEvents.some(
      (item) => String(item.id) === String(event.id),
    );

    if (alreadyRegistered) {
      const updatedEvents = registeredEvents.filter(
        (item) => String(item.id) !== String(event.id),
      );

      localStorage.setItem("registeredEvents", JSON.stringify(updatedEvents));

      // ubah tombol menjadi Join Event
      setRegistered(false);

      return;
    }

    const updatedEvents = [...registeredEvents, event];

    localStorage.setItem("registeredEvents", JSON.stringify(updatedEvents));

    // ubah tombol menjadi Registered
    setRegistered(true);
  }

  // JIKA EVENT TIDAK DITEMUKAN
  if (!event) {
    return (
      <>
        <div className="p-10">
          <h1 className="text-2xl font-bold">Event not found</h1>

          <Link to="/event" className="mt-3 inline-block text-orange-primary">
            ← Back to Events
          </Link>
        </div>
      </>
    );
  }

  // HITUNG PERSENTASE ATTENDEES
  const percentage = Math.round((event.attendees / event.capacity) * 100);

  return (
    <>
      {/* BACK */}
      <div className="border-b border-gray-200 px-4 py-4 md:px-10">
        <Link to="/event" className="text-sm text-gray-secondary">
          ← Back to Events
        </Link>
      </div>

      {/* CONTENT */}
      <main className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* LEFT CONTENT */}
          <div className="lg:col-span-2">
            <img
              src={event.image}
              alt={event.title}
              className="h-56 w-full rounded-xl object-cover md:h-96"
            />

            {/* CATEGORY */}
            <div className="mt-4 flex gap-2">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-500">
                {event.category}
              </span>

              <span className="rounded-full bg-green-50 px-3 py-1 text-xs text-green-500">
                Available
              </span>
            </div>

            {/* TITLE */}
            <h1 className="mt-3 text-2xl font-bold md:text-3xl">
              {event.title}
            </h1>

            {/* ABOUT */}
            <section className="mt-6">
              <h2 className="font-semibold">About this event</h2>

              <p className="mt-3 text-sm leading-6 text-gray-secondary">
                Join this event and connect with people who share similar
                interests. Learn new skills, exchange ideas, and participate in
                an engaging community experience.
              </p>
            </section>

            {/* SPEAKERS */}
            <section className="mt-7">
              <h2 className="font-semibold">Speakers</h2>

              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="font-semibold">Ahmad Fauzan</p>
                  <p className="text-xs text-gray-secondary">Staff Engineer</p>
                </div>

                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="font-semibold">Dina Rahayu</p>
                  <p className="text-xs text-gray-secondary">Backend Lead</p>
                </div>
              </div>
            </section>

            {/* DISCUSSION */}
            <section className="mt-7">
              <h2 className="flex items-center gap-2 font-semibold">
                {" "}
                <FiMessageCircle />
                Discussion
                <span className="text-sm font-normal text-gray-secondary">
                  ({comments.length})
                </span>
              </h2>

              <div className="mt-3 space-y-3">
                {comments.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-gray-200 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{item.author}</p>

                      <span className="text-xs text-gray-secondary">
                        {item.time}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-gray-secondary">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* form diskusi */}
              <form
                onSubmit={handleAddComment}
                className="mt-3 flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2"
              >
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add to the discussion..."
                  className="flex-1 bg-transparent text-sm outline-none"
                />

                <button
                  type="submit"
                  className="text-orange-primary"
                  aria-label="Send comment"
                >
                  <FiSend />
                </button>
              </form>
            </section>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside>
            <div className="rounded-xl border border-gray-200 p-5">
              <p className="text-xs font-semibold text-gray-secondary">
                EVENT INFO
              </p>

              <div className="mt-4 space-y-3 text-sm text-gray-secondary">
                <div className="flex items-center gap-2">
                  <FiCalendar />
                  <span>{event.date}</span>
                </div>

                <div className="flex items-center gap-2">
                  <FiClock />
                  <span>{event.time}</span>
                </div>

                <div className="flex items-center gap-2">
                  <FiMapPin />
                  <span>{event.location}</span>
                </div>

                <div className="flex items-center gap-2">
                  <FiUsers />
                  <span>
                    {event.attendees} / {event.capacity}
                  </span>
                </div>
              </div>

              {/* CAPACITY */}
              <div className="mt-5">
                <div className="flex justify-between text-xs text-gray-secondary">
                  <span>{event.attendees} attendees</span>
                  <span>{event.capacity} capacity</span>
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

              <button
                type="button"
                onClick={handleRegister}
                className={`mt-4 w-full rounded-lg py-2.5 text-sm text-white-primary ${
                  registered ? "bg-green-primary" : "bg-orange-primary"
                }`}
              >
                {registered ? "Registered" : "Join Event"}
              </button>

              {/* ACTION */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className="rounded-lg border border-gray-200 py-2 text-sm"
                >
                  Save
                </button>

                <button
                  type="button"
                  className="rounded-lg border border-gray-200 py-2 text-sm"
                >
                  Share
                </button>
              </div>
            </div>

            {/* ORGANIZER */}
            <div className="mt-4 rounded-xl border border-gray-200 p-5">
              <p className="text-xs font-semibold text-gray-secondary">
                ORGANIZED BY
              </p>

              <div className="mt-4">
                <p className="font-semibold">Rizky Pratama</p>

                <p className="text-xs text-orange-primary">
                  EventHub Community
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}

export default EventDetail;
