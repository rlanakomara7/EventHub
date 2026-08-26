import { Link, useParams } from "react-router";
import { useState } from "react";
import { MdPeopleAlt } from "react-icons/md";
import { FiCalendar, FiMapPin } from "react-icons/fi";

import communities from "../../data/communities.json";
import events from "../../data/events.json";

import EventCard from "../../components/EventCard";

function CommunityDetail() {
  const { id } = useParams();

  const community = communities.find((item) => String(item.id) === String(id));

  const [activeTab, setActiveTab] = useState("Events");

  //komentar
  const [comment, setComment] = useState("");

  const [comments, setComments] = useState(() => {
    return (
      JSON.parse(localStorage.getItem(`communityComments-${id}`)) || [
        {
          id: 1,
          user: "Ahmad Fauzan",
          time: "1d ago",
          avatar: "/Default-Avatar.svg",
          message:
            "Welcome everyone to our community! Excited to have so many new members join this month.",
        },
        {
          id: 2,
          user: "Dina Rahayu",
          time: "3d ago",
          avatar: "/Default-Avatar.svg",
          message:
            "Has anyone tried the new generics features in Go 1.22? Would love to discuss at the next meetup.",
        },
      ]
    );
  });

  function handleAddComment() {
    if (!comment.trim()) return;

    const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {
      name: "Guest",
      image: "/Default-Avatar.svg",
    };

    const newComment = {
      id: Date.now(),
      user: currentUser.name,
      time: "now",
      avatar: currentUser.image || "/Default-Avatar.svg",
      message: comment,
    };

    const updated = [newComment, ...comments];

    setComments(updated);

    localStorage.setItem(`communityComments-${id}`, JSON.stringify(updated));

    setComment("");
  }
  //

  if (!community) {
    return (
      <div className="p-10">
        <h1 className="text-2xl font-bold">Community not found</h1>

        <Link
          to="/communities"
          className="mt-3 inline-block text-orange-primary"
        >
          ← Back to Communities
        </Link>
      </div>
    );
  }

  //komentar

  //
  const communityEvents = events.filter(
    (event) =>
      event.location === community.location ||
      event.category === community.category,
  );

  return (
    <>
      {/* BACK */}
      <div className="border-b border-gray-200 px-4 py-4 md:px-10">
        <Link to="/communities" className="text-sm text-gray-secondary">
          ← Back to Communities
        </Link>
      </div>

      {/* HERO */}
      <section className="w-full">
        <div className="overflow-hidden border-b border-gray-200 bg-white">
          <div className="relative h-56 md:h-72">
            <img
              src={community.image}
              alt={community.name}
              className="h-full w-full object-cover"
            />

            {/* overlay */}
            <div className="absolute inset-0 bg-black/40"></div>

            <div className="absolute bottom-6 left-0 w-full px-6 md:px-16 text-white">
              <h1 className="text-2xl font-bold md:text-4xl">
                {community.name}
              </h1>

              <div className="mt-2 flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <MdPeopleAlt />
                  {community.members.toLocaleString("id-ID")} members
                </span>

                <span className="flex items-center gap-1">
                  <FiCalendar />
                  {community.upcomingEvents} upcoming events
                </span>

                <span className="flex items-center gap-1">
                  <FiMapPin />
                  {community.location}
                </span>
              </div>
            </div>

            <button className=" absolute right-6 bottom-6 rounded-lg bg-green-primary px-5 py-2 text-sm text-white-primary ">
              Joined
            </button>
          </div>

          {/* DESCRIPTION */}
          <div className="mx-auto max-w-6xl p-5">
            <p className="text-sm leading-6 text-gray-secondary">
              {community.description}
            </p>

            <div className="mt-4 flex gap-2">
              <span className=" rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-500 ">
                {community.category}
              </span>

              <span className=" rounded-full bg-green-50 px-3 py-1 text-xs text-green-500 ">
                Programming
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <main className="mx-auto max-w-6xl px-4 pb-10 md:px-6">
        {/* TAB */}
        <div className="border-b border-gray-200">
          <div className="flex gap-6">
            {["Events", "Members", "Discussion"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  py-3
                  text-sm
                  ${
                    activeTab === tab
                      ? "border-b-2 border-orange-primary text-orange-primary"
                      : "text-gray-secondary"
                  }
                  `}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* EVENTS */}
        {activeTab === "Events" && (
          <section className="mt-6">
            <h2 className="mb-4 text-xs font-semibold text-gray-secondary">
              UPCOMING
            </h2>

            <div className=" grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 ">
              {communityEvents.length > 0 ? (
                communityEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onAuthRequired={() => {}}
                    onEventClick={(id) => {
                      window.location.href = `/event/${id}`;
                    }}
                  />
                ))
              ) : (
                <p className="text-sm text-gray-secondary">
                  No upcoming events.
                </p>
              )}
            </div>
          </section>
        )}

        {/* MEMBERS */}
        {activeTab === "Members" && (
          <div className="mt-6 rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold">Members</h2>

            <p className="mt-3 text-sm text-gray-secondary">
              {community.members.toLocaleString("id-ID")} people joined this
              community.
            </p>
          </div>
        )}

        {/* DISCUSSION */}

        {activeTab === "Discussion" && (
          <section className="mt-5 space-y-4">
            {/* INPUT DISCUSSION */}

            <div className="flex items-center gap-3">
              <img
                src="/Default-Avatar.svg"
                className=" h-8 w-8 rounded-full object-cover "
              />

              <div className=" flex flex-1 items-center rounded-xl border border-gray-200 bg-white px-4 ">
                <input
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Start a discussion..."
                  className=" flex-1 py-3 text-sm outline-none "
                />

                <button
                  onClick={handleAddComment}
                  className="  text-orange-primary  font-bold  "
                >
                  &gt;
                </button>
              </div>
            </div>

            {/* COMMENT LIST */}

            <div className="space-y-3">
              {comments.map((item) => (
                <div key={item.id} className=" flex gap-3 ">
                  <img
                    src={item.avatar}
                    className=" h-8 w-8 rounded-full object-cover "
                  />

                  <div className=" flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 ">
                    <div className=" flex items-center gap-2 ">
                      <p className="  text-sm  font-semibold  ">{item.user}</p>

                      <span className=" text-xs text-gray-secondary ">
                        {item.time}
                      </span>
                    </div>

                    <p className=" mt-1 text-sm text-gray-secondary ">
                      {item.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}

export default CommunityDetail;
