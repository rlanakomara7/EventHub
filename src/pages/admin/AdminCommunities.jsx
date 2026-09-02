import AdminTabsFilter from "../../components/AdminTabsFilter";
import communitiesData from "../../data/communities.json";

function AdminCommunities() {
  const communities = communitiesData;

  return (
    <main className="mx-auto md:max-w-8xl p-6 md:p-10 ">
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

      {/* COMMUNITY LIST */}

      <div className="  mt-5  space-y-3">
        {communities.map((community) => (
          <div
            key={community.id}
            className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white px-4 py-3"
          >
            {/* IMAGE */}

            <img
              src={community.image}
              alt={community.name}
              className="  h-10  w-10  rounded-lg  object-cover"
            />

            {/* INFORMATION */}

            <div className="flex-1">
              <h3 className="text-sm  font-medium  text-gray-900">
                {community.name}
              </h3>

              <p className="   text-xs   text-gray-400 ">
                {community.members.toLocaleString()}
                {" members · "}
                {community.upcomingEvents}
                {" upcoming events"}
              </p>
            </div>

            {/* STATUS */}

            <span className="rounded-full  bg-green-50  px-3  py-1  text-xs  text-green-600">
              Active
            </span>

            {/* ACTION */}

            <button
              type="button"
              className=" text-gray-400  hover:text-gray-700"
            >
              ⋯
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

export default AdminCommunities;
