import { useEffect } from "react";
import { Outlet } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import Header from "../components/Header";

import { selectUser } from "../redux/slice/authSlice";
import { fetchJoinedEvents } from "../redux/slice/eventMemberSlice";

function AttendeeLayout() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  useEffect(() => {
    if (!user) return;

    const request = dispatch(fetchJoinedEvents());

    return () => request.abort();
  }, [dispatch, user]);

  return (
    <div className="min-h-screen bg-white text-black-primary transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-100">
      <Header />

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default AttendeeLayout;
