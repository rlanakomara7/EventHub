import { NavLink } from "react-router";

function AdminTabsFilter() {
  const tabs = [
    {
      name: "Overview",
      path: "/admin",
    },
    {
      name: "Users",
      path: "/admin/users",
    },
    {
      name: "Events",
      path: "/admin/events",
    },
    {
      name: "Communities",
      path: "/admin/communities",
    },
  ];

  return (
    <div className="mt-8 border-b border-gray-200">
      <div className="flex gap-8">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.path === "/admin"}
            className={({ isActive }) =>
              `
              pb-3 text-sm font-medium
              ${
                isActive
                  ? "border-b-2 border-orange-primary text-orange-primary"
                  : "text-gray-secondary"
              }
              `
            }
          >
            {tab.name}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default AdminTabsFilter;
