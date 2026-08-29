import { useNavigate } from "react-router";
import { useState } from "react";
import EventCard from "../../components/EventCard";
import MyProfileFilter from "../../components/MyProfileFilter";

function MyProfile() {
  const [activeTab, setActiveTab] = useState("Events");
  const navigate = useNavigate();

  const [registeredEvents, setRegisteredEvents] = useState(() => {
    return JSON.parse(localStorage.getItem("registeredEvents")) || [];
  });

  function handleEventClick(eventId) {
    navigate(`/event/${eventId}`);
  }

  function handleUnregister(eventId) {
    const updatedEvents = registeredEvents.filter(
      (event) => String(event.id) !== String(eventId),
    );

    // UPDATE LOCAL STORAGE
    localStorage.setItem("registeredEvents", JSON.stringify(updatedEvents));

    // UPDATE STATE
    setRegisteredEvents(updatedEvents);
  }

  return (
    <>
      <div className=" mt-10">
        <div className=" max-w-4xl mx-auto flex items-start justify-between">
          <div className="flex gap-5">
            <div className="relative">
              <img
                src="/SON_9681.JPG"
                alt="profile"
                className="w-20 h-20 rounded-2xl object-cover"
              />

              {/* status online */}
              <span className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-md border-2 border-white"></span>
            </div>

            {/* Detail */}
            <div className="flex flex-col">
              <h2 className="font-bold text-2xl">Rama</h2>

              <p className="text-gray-500">Rama@gmail.com</p>

              {/* data */}
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span>📍Indonesia</span>

                <span>▣ Joined March 2025</span>

                <span className="bg-orange-100 text-orange-500 px-2 py-1 rounded-full">
                  Attendee
                </span>
              </div>

              {/* Description */}
              <p className="mt-3 max-w-xl text-gray-600 leading-relaxed">
                Backend engineer & community builder. Passionate about Go,
                distributed systems, and connecting people through events.
              </p>
            </div>
          </div>

          {/* Button */}
          <button className=" border border-gray-300  rounded-lg  px-4 py-2  flex items-center gap-2 text-gray-700 ">
            ✎ Edit Profile
          </button>
        </div>

        {/* Statistik */}
        <div className="max-w-4xl mx-auto grid grid-cols-3 mt-8 py-5 text-center">
          <div>
            <h3 className="font-bold text-2xl">3</h3>
            <p className="text-gray-500">Events</p>
          </div>

          <div className="border-x border-gray-300  ">
            <h3 className="font-bold text-2xl">3</h3>
            <p className="text-gray-500">Communities</p>
          </div>

          <div>
            <h3 className="font-bold text-2xl">2</h3>
            <p className="text-gray-500">Saved</p>
          </div>
        </div>

        <MyProfileFilter activeTab={activeTab} setActivetab={activeTab} />
        <section className="min-h-screen bg-white-secondary py-6">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {activeTab === "saved" &&
                registeredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isRegistered={true}
                    onEventClick={handleEventClick}
                    onUnregister={handleUnregister}
                  />
                ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default MyProfile;
