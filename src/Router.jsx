import { BrowserRouter, Routes, Route } from "react-router";
import Event from "./pages/guest/Event";
import Explore from "./pages/guest/Explore";
import Communities from "./pages/guest/Communities";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ForgotPasswordSucces from "./pages/auth/ForgotPasswordSucces";
import MyEvents from "./pages/attendee/MyEvents";
import EventDetail from "./pages/guest/EventDetail";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Guest */}
        <Route path="/" element={<Explore />} />
        <Route path="/event" element={<Event />} />
        <Route path="/event/:id" element={<EventDetail />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/communities" element={<Communities />} />

        {/* Attende */}
        <Route path="/myevents" element={<MyEvents />} />

        {/* Auth*/}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/forgot-password-succes"
          element={<ForgotPasswordSucces />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
