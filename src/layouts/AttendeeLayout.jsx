import { Outlet } from "react-router";
import Header from "../components/Header";

function AttendeeLayout() {
  const handleJoin = () => {};
  const handleEventClick = () => {};
  return (
    <div>
      <Header />
      <main>
        <Outlet context={{ handleJoin, handleEventClick }} />
      </main>
    </div>
  );
}

export default AttendeeLayout;
