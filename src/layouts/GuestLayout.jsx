import { Outlet, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSavedEvents } from "../redux/slice/savedEventSlice";

import { selectUser } from "../redux/slice/authSlice";
import { fetchJoinedEvents } from "../redux/slice/eventMemberSlice";

import Header from "../components/Header";
import ModalSign from "../components/ModalSign";

function GuestLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentUser = useSelector(selectUser);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    const joinedRequest = dispatch(fetchJoinedEvents());
    const savedRequest = dispatch(fetchSavedEvents());

    return () => {
      joinedRequest.abort();
      savedRequest.abort();
    };
  }, [dispatch, currentUser]);

  function handleGlobalJoin() {
    setShowModal(true);
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
