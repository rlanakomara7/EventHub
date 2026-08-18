import Header from "../../components/Header";
import EventCard from "../../components/EventCard";
import MyEventsFilter from "../../components/MyEventsFilter";
import events from "../../data/events.json";

function MyEvents() {
  return (
    <>
      <Header titie="My Events" />

      <div className="mx-auto max-w-6xl px-6 py-5 ">
        <h1 className="font-bold text-3xl text-black-primary">My Events</h1>
        <MyEventsFilter />
      </div>

      <section className="py-6 min-h-screen bg-white-secondary">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {/* sementara tampilkan 1 event dulu */}
            <EventCard event={events[0]} isRegistered={true} />
          </div>
        </div>
      </section>
    </>
  );
}

export default MyEvents;
