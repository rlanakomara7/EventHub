import { Outlet, useNavigate } from "react-router";
import { useState } from "react";

//component
import Header from "../components/Header";
import ModalSign from "../components/ModalSign";
import Footer from "../components/Footer";

function GuestLayout() {
  const [showModal, setShowModal] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const navigate = useNavigate();

  function handleGlobalJoin(event) {
    // Belum login
    if (!currentUser) {
      setShowModal(true);
      return;
    }

    //data dari localStorage
    const registeredEvents =
      JSON.parse(localStorage.getItem("registeredEvents")) || [];

    // Cek apakah event sudah ada
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
    <div>
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
      <Footer />
      {showModal && <ModalSign onClose={() => setShowModal(false)} />}
    </div>
  );
}

export default GuestLayout;
