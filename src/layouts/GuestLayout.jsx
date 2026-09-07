import { Outlet, useNavigate } from "react-router";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/slice/authSlice";

//component
import Header from "../components/Header";
import ModalSign from "../components/ModalSign";

function GuestLayout() {
  const [showModal, setShowModal] = useState(false);

  const currentUser = useSelector(selectUser);

  const navigate = useNavigate();

  function handleGlobalJoin(event) {
    // Belum login
    if (!currentUser) {
      setShowModal(true);
      return;
    }

    //data localStorage
    const registeredEvents =
      JSON.parse(localStorage.getItem("registeredEvents")) || [];

    // Cek event
    const alreadyRegistered = registeredEvents.some(
      (item) => item.id === event.id,
    );

    if (alreadyRegistered) {
      // UNREGISTER

      const updatedEvents = registeredEvents.filter(
        (item) => item.id !== event.id,
      );

      localStorage.setItem("registeredEvents", JSON.stringify(updatedEvents));
    } else {
      // REGISTER

      const updatedEvents = [...registeredEvents, event];

      localStorage.setItem("registeredEvents", JSON.stringify(updatedEvents));
    }
  }

  function handleEventClick(eventId) {
    if (!currentUser) {
      setShowModal(true);
      return;
    }
    navigate(`/event/${eventId}`);
  }

  return (
    <div className="min-h-screen bg-white text-black-primary transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-100">
      <Header />
      <main>
        <Outlet
          context={{
            handleJoin: handleGlobalJoin,
            handleEventClick,
            currentUser,
          }}
        />
      </main>
      {showModal && <ModalSign onClose={() => setShowModal(false)} />}
    </div>
  );
}

export default GuestLayout;
