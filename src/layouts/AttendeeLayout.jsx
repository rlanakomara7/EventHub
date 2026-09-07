import { Outlet } from "react-router";
import Header from "../components/Header";

function AttendeeLayout() {
  const handleJoin = () => {};
  const handleEventClick = () => {};
  return (
    <div className="min-h-screen bg-white text-black-primary transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-100">
      <Header />
      <main>
        <Outlet context={{ handleJoin, handleEventClick }} />
      </main>
    </div>
  );
}

export default AttendeeLayout;
