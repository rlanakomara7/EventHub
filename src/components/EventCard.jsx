import { FiCalendar } from "react-icons/fi";
import { FaBookmark } from "react-icons/fa";
import { MdPeopleAlt } from "react-icons/md";
import { FaLocationPin } from "react-icons/fa6";
import { useState, useEffect } from "react";

function EventCard({
  event,
  onAuthRequired,
  onEventClick,
  isRegistered = false,
  // onUnregister,
}) {
  //state
  const [registered, setRegistered] = useState(isRegistered);

  //ceklocalstorage
  useEffect(() => {
    const registeredEvents =
      JSON.parse(localStorage.getItem("registeredEvents")) || [];

    const alreadyRegistered = registeredEvents.some(
      (item) => String(item.id) === String(event.id),
    );

    setRegistered(alreadyRegistered);
  }, [event.id]);

  const percentage = (event.attendees / event.capacity) * 100;

  return (
    <>
      <article className="flex flex-col h-full overflow-hidden rounded-xl border border-gray-200 bg-white-secondary shadow-sm">
        <div onClick={() => onEventClick(event.id)} className="cursor-pointer">
          <img
            src={event.image}
            alt={event.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="px-4 py-2 align-bottom space-y-2">
          <h3
            onClick={() => onEventClick(event.id)}
            className="font-bold text-2xl py-2"
          >
            {event.title}
          </h3>

          <div className="flex flex-row items-center gap-2 text-gray-secondary">
            <FiCalendar />
            <p>
              {event.date} . {event.time}
            </p>
          </div>

          <div className="flex flex-row items-center gap-2 text-gray-secondary">
            <FaLocationPin />
            <p>{event.location}</p>
          </div>

          <div className="flex flex-row items-center gap-2 text-gray-secondary">
            <MdPeopleAlt />
            <p>
              {Math.round((event.attendees / event.capacity) * 100)}% attendees
            </p>
          </div>
        </div>
        <div className="px-4 py-2 space-y-4">
          <div className="flex flex-row justify-between  text-gray-secondary">
            <p>{event.attendees}attendees</p>
            <p>{event.capacity}capacity</p>
          </div>
          <div className="">
            <div className="bg-gray-secondary mt-2 h-2 w-full rounded-full">
              <div
                className="bg-green-primary mt-2 h-2 rounded-full"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center gap-2 text-gray-secondary px-4 py-4 ">
          <button
            className={`flex-1 rounded-xl p-1 text-center text-white-secondary ${
              registered ? "bg-green-primary" : "bg-orange-primary"
            }`}
            onClick={(e) => {
              e.stopPropagation();

              // Jalankan register / unregister
              onAuthRequired(event);

              // Kalau belum login, jangan ubah tombol
              if (!localStorage.getItem("currentUser")) {
                return;
              }

              // Toggle tampilan
              setRegistered(!registered);
            }}
          >
            {registered ? "Registered" : "Join Event"}
          </button>
          <button typeof="submit" className="items-center">
            <FaBookmark className="text-2xl" />
          </button>
        </div>
      </article>
    </>
  );
}

export default EventCard;
