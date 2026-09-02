import AdminStatsCard from "../../components/AdminStatsCard";
import AdminTabsFilter from "../../components/AdminTabsFilter";

import { GoPeople } from "react-icons/go";
import { SlCalender } from "react-icons/sl";
import { FiFlag } from "react-icons/fi";
import { HiOutlineUserGroup } from "react-icons/hi2";

function AdminDashboard() {
  const stats = [
    {
      title: "TOTAL USERS",
      value: "12,841",
      subtitle: "+284 this month",
    },
    {
      title: "TOTAL EVENTS",
      value: "12",
      subtitle: "8 upcoming",
    },
    {
      title: "COMMUNITIES",
      value: "8",
      subtitle: "All active",
    },
    {
      title: "AVG FILL RATE",
      value: "74%",
      subtitle: "Across all events",
    },
  ];

  const activities = [
    {
      icon: GoPeople,
      color: "text-green-500",
      text: "284 new users registered this month",
      time: "Today",
    },
    {
      icon: SlCalender,
      color: "text-blue-500",
      text: '"AI Product Design Summit" reached 234 registrations',
      time: "2h ago",
    },
    {
      icon: FiFlag,
      color: "text-orange-500",
      text: "3 new organizer applications received",
      time: "5h ago",
    },
    {
      icon: HiOutlineUserGroup,
      color: "text-green-500",
      text: "Jakarta AI & ML Club crossed 2,000 members",
      time: "1d ago",
    },
  ];

  return (
    <main className="mx-auto max-w-8xl p-6 md:p-10">
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

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((item) => (
          <AdminStatsCard key={item.title} {...item} />
        ))}
      </div>

      {/* recent */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="  text-sm  font-semibold  text-gray-900">
          Recent Platform Activity
        </h2>

        <div className="mt-4 space-y-3">
          {activities.map((item, index) => (
            <div key={index} className="  flex  items-center  justify-between">
              <div className="flex items-center gap-3">
                <span className={item.color}>
                  <item.icon className="h-4 w-4" />
                </span>
                <p className="text-sm   text-gray-600 ">{item.text}</p>
              </div>

              <span className="text-xs text-gray-400">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default AdminDashboard;
