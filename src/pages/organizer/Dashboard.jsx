import { FaPlus } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import { GoPeople } from "react-icons/go";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa";
import { GoPencil } from "react-icons/go";
import ChartDashboard from "../../components/ChartDashboard";

function Dashboard() {
  const percentage = (event.attendees / event.capacity) * 100;
  const total = [
    {
      title: "TOTAL EVENTS",
      count: `${2}`,
      sub: "All time",
      logo: SlCalender,
    },
    {
      title: "TOTAL ATTENDEES",
      count: `${103}`,
      sub: "Across all events",
      logo: GoPeople,
    },
    {
      title: "AVG FILL RATE",
      count: `${57}%`,
      sub: "capacity Utilization",
      logo: FaArrowTrendUp,
    },
    {
      title: "EVENT VIEWS",
      count: `${2}`,
      sub: "Last 30 days",
      logo: FaRegEye,
    },
  ];

  return (
    <main className="m-10 md:max-w-6xl mx-auto">
      <div className="flex flex-col gap-4 ml-3 md:flex-row justify-between">
        <div>
          <h1 className="font-bold text-2xl md:text-3xl">
            Organizer Dashboard
          </h1>
          <p className="text-gray-secondary">
            Manage your events and track performance.
          </p>
        </div>

        <button className="bg-orange-primary text-white flex flex-row items-center gap-2 px-2 py-2 w-fit h-fit rounded-lg shrink-0">
          <FaPlus /> Create Event
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 mt-6 ml-3 gap-3">
        {total.map((e, idx) => {
          const Icons = e.logo;
          return (
            <div
              key={idx}
              className="border border-gray-secondary/20 rounded-lg p-5 shadow-xl gap-2 "
            >
              <div className="flex flex-row justify-between leading-10">
                <p className="text-gray-secondary font-medium">{e.title}</p>
                <Icons />
              </div>
              <div>
                <p className="font-bold text-2xl">{e.count}</p>
                <p className="text-gray-secondary text-xs">{e.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-5">Your Events</h2>
        <div className="grid grid-cols-[7fr_3fr] gap-4">
          <div className="border border-gray-200 rounded-xl p-5 flex gap-5 ">
            <div>
              <img
                src="Image-(Go-Concurrency-Workshop).svg"
                alt="#"
                className=" w-24 h-20 rounded-xl object-cover"
              />
            </div>

            <div className="flex-1">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold text-lg">GO Currency</h3>
                  <p className="text-gray-500 text-sm">
                    Aug 22, 2026 · Bandung
                  </p>
                </div>
                <span className="bg-green-500/20 text-green-700 rounded-full text-sm h-fit px-3 py-1">
                  Active
                </span>
              </div>

              <div className="flex flex-row justify-between mt-5 mb-2 text-sm text-gray-500">
                <p>48 Attendees</p>
                <p>100 Capacity</p>
              </div>

              <div className="bg-gray-200 h-2 rounded-xl w-full">
                <div className="bg-green-600 h-2 rounded-xl w-full"></div>
              </div>

              <div className="flex mt-4 gap-4">
                <button className="flex flex-row items-center border px-4 rounded-lg py-2 gap-2">
                  <GoPencil /> Edit
                </button>
                <button className=" flex items-center gap-2 text-gray-700 ">
                  <FaRegEye /> 48 attendees
                </button>
              </div>
            </div>
          </div>

          <aside className="w-full">
            <ChartDashboard />
            <div className="bg-white rounded-xl border border-gray-200 p-5 mt-5 ">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="flex flex-col gap-3">
                <button className="bg-orange-primary text-white rounded-lg py-2 w-full flex items-center justify-center gap-2 text-sm">
                  + Create New Event
                </button>
                <button className=" bg-gray-100 text-gray-700 rounded-lg py-2 w-full flex items-center justify-center gap-2 text-sm">
                  <FaRegEye /> Preview as Attendee
                </button>
              </div>
            </div>
            <div className=" bg-white rounded-xl border border-gray-200 p-5 mt-5 w-full ">
              <h3 className="font-semibold text-sm mb-4">Upcoming Events</h3>

              <div className="flex flex-col">
                <div className="  flex  items-center  justify-between  py-3 h-fit border-b  border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className=" w-2 h-2 bg-green-500 rounded-full"></span>

                    <div>
                      <p className="text-sm font-medium">
                        Go Concurrency Workshop
                      </p>

                      <p className="text-xs text-gray-400">Aug 22, 2026</p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500">48/100</p>
                </div>

                {/* Event Item 2 */}
                <div className=" flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <span className="  w-2  h-2  bg-green-500  rounded-full"></span>

                    <div>
                      <p className="text-sm font-medium">Kubernetes Workshop</p>

                      <p className="text-xs text-gray-400">Sep 12, 2026</p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500">55/80</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
