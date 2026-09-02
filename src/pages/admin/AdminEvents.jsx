import AdminTabsFilter from "../../components/AdminTabsFilter";
import { getEvents } from "../../utils/eventStorage";

function AdminEvents() {
  const events = getEvents();

  return (
    <main className="mx-auto md:max-w-8xl p-6  md:p-10">
      <div className="flex gap-3 items-center">
        <span className="text-2xl font-bold md:text-4xl bg-orange-primary/30 rounded-md px-1 pb-1">
          🛡
        </span>{" "}
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Admin Dashboard</h1>
          <p className="text-sm text-gray-secondary">
            Platform management and moderation
          </p>
        </div>
      </div>

      <AdminTabsFilter />

      {/* EVENT LIST */}

      <div className="mt-5 space-y-3 ">
        {events.length === 0 ? (
          <div className=" rounded-xl border bg-white p-5 text-sm text-gray-secondary ">
            No events available.
          </div>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white   px-4   py-3 "
            >
              {/* IMAGE */}

              <img
                src={event.image || "/Default-Event.png"}
                alt={event.title}
                className="   h-10   w-12   rounded-lg   object-cover "
              />

              {/* TITLE */}

              <div className="min-w-0 flex-1 ">
                <h3 className="truncate text-sm font-medium text-gray-900 ">
                  {event.title}
                </h3>

                <p className="text-xs text-gray-400 ">
                  {event.date}
                  {" · "}
                  {event.eventFormat === "online" ? "Online" : event.location}
                </p>
              </div>

              {/* ATTENDEES */}

              <div className="hidden text-xs text-gray-500 md:block ">
                {event.attendees || 0}/{event.capacity || 0}
              </div>

              {/* STATUS */}

              <span
                className={`rounded-full px-3 py-1 ${event.attendees >= event.capacity ? "bg-red-50 text-red-500" : "bg-green-50 text-green-600"} `}
              >
                {event.attendees >= event.capacity ? "full" : "Active"}
              </span>

              {/* ACTION */}

              <button
                type="button"
                className=" text-gray-400 hover:text-gray-700   "
              >
                ⋯
              </button>
            </div>
          ))
        )}
      </div>
    </main>
  );
}

export default AdminEvents;
