import AdminTabsFilter from "../../components/AdminTabsFilter";

function AdminUsers() {
  const users = [
    {
      name: "Alex Kim",
      email: "alex.kim@example.com",
      role: "attendee",
      status: "active",
      joined: "Mar 2025",
    },
    {
      name: "Rizky Pratama",
      email: "rizky@example.com",
      role: "organizer",
      status: "active",
      joined: "Jan 2025",
    },
    {
      name: "Siti Rahayu",
      email: "siti@example.com",
      role: "attendee",
      status: "active",
      joined: "Apr 2025",
    },
    {
      name: "Hendra Wijaya",
      email: "hendra@example.com",
      role: "organizer",
      status: "suspended",
      joined: "Feb 2025",
    },
    {
      name: "Anisa Putri",
      email: "anisa@example.com",
      role: "attendee",
      status: "active",
      joined: "May 2025",
    },
  ];

  return (
    <main className="mx-auto md:max-w-8xl p-6 md:p-10">
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

      <input
        type="text"
        placeholder="Search users..."
        className=" mt-5 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm "
      />

      <div
        className=" mt-5 overflow-hidden rounded-xl border border-gray-200 bg-white
      "
      >
        <table className="w-full">
          <thead>
            <tr
              className=" border-b text-left text-xs text-gray-secondary
            "
            >
              <th className="px-5 py-4">USER</th>

              <th className="px-5 py-4">ROLE</th>

              <th className="px-5 py-4">STATUS</th>

              <th className="px-5 py-4">JOINED</th>

              <th></th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.email} className="border-blast:border-none ">
                <td className="px-5 py-4">
                  <p className="text-sm font-medium">{user.name}</p>

                  <p className="text-xs text-gray-400">{user.email}</p>
                </td>

                <td className="px-5 py-4">
                  <span className="   rounded-full   bg-gray-100   px-3   py-1   text-xs ">
                    {user.role}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <span className="   rounded-full   bg-green-50   px-3   py-1   text-xs   text-green-600 ">
                    {user.status}
                  </span>
                </td>

                <td className="  px-5  py-4  text-sm  text-gray-400">
                  {user.joined}
                </td>

                <td className="px-5 py-4 text-right">⋯</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default AdminUsers;
