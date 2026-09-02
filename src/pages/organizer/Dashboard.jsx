import { FaPlus } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import { GoPeople } from "react-icons/go";
import { FaArrowTrendUp, FaRegEye } from "react-icons/fa6";
import { GoPencil } from "react-icons/go";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

import ChartDashboard from "../../components/ChartDashboard";
import { getEvents } from "../../utils/eventStorage";

function Dashboard() {
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state.auth.user);

  const allEvents = getEvents();

  //Dashboard organizer
  if (currentUser?.role !== "organizer") {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold">Access denied</h1>
        <p className="mt-2 text-gray-secondary">
          Halaman ini hanya dapat diakses oleh organizer.
        </p>
      </div>
    );
  }

  // event tanpa organizerId dianggap data lama
  const myEvents = allEvents.filter(
    (event) =>
      !event.organizerId ||
      String(event.organizerId) === String(currentUser.id),
  );

  const totalAttendees = myEvents.reduce(
    (total, event) => total + Number(event.attendees || 0),
    0,
  );

  const averageFillRate =
    myEvents.length > 0
      ? Math.round(
          myEvents.reduce(
            (total, event) =>
              total + (Number(event.attendees || 0) / event.capacity) * 100,
            0,
          ) / myEvents.length,
        )
      : 0;

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
      count: `${averageFillRate}%`,
      sub: "Capacity utilization",
      logo: FaArrowTrendUp,
    },
    {
      title: "EVENT VIEWS",
      count: myEvents.reduce(
        (total, event) => total + Number(event.views || 0),
        0,
      ),
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

              <p className="mt-4 text-2xl font-bold">{item.count}</p>

              <p className="text-xs text-gray-secondary">{item.sub}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-[7fr_3fr]">
        <section>
          <h2 className="mb-5 text-xl font-bold">Your Events</h2>

          <div className="space-y-4">
            {myEvents.length === 0 ? (
              <p className="text-sm text-gray-secondary">Belum ada event.</p>
            ) : (
              myEvents.map((event) => {
                const percentage = Math.round(
                  (event.attendees / event.capacity) * 100,
                );

                return (
                  <div
                    key={event.id}
                    className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4"
                  >
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-20 w-24 rounded-lg object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-3">
                        <div>
                          <h3 className="font-semibold">{event.title}</h3>

                          <p className="text-sm text-gray-secondary">
                            {event.date} · {event.location}
                          </p>
                        </div>

                        <span className="h-fit rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                          Active
                        </span>
                      </div>

                      <div className="mt-4 flex justify-between text-xs text-gray-secondary">
                        <span>{event.attendees} attendees</span>
                        <span>{event.capacity} capacity</span>
                      </div>

                      <div className="mt-2 h-2 rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-green-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/dashboard/events/${event.id}/edit`)
                        }
                        className="mt-4 flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm"
                      >
                        <GoPencil />
                        Edit
                      </button>
                    </div>
                  </div>
                );
              })
            )}
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
