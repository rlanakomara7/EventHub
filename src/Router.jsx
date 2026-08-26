import { BrowserRouter, Routes, Route } from "react-router";

// Layout
import GuestLayout from "./layouts/GuestLayout";
import AuthLayout from "./layouts/AuthLayout";
import AttendeeLayout from "./layouts/AttendeeLayout";

//event
import Event from "./pages/guest/Event";
import Explore from "./pages/guest/Explore";
import Communities from "./pages/guest/Communities";
import CommunityDetail from "./pages/attendee/CommunityDetail";

//attendee
import ProtectedRoute from "./ProtectedRoute";
import MyEvents from "./pages/attendee/MyEvents";
import EventDetail from "./pages/attendee/EventDetail";
import MyProfile from "./pages/attendee/MyProfile";

// auth
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ForgotPasswordSuccess from "./pages/auth/ForgotPasswordSuccess";
import Notification from "./pages/attendee/Notification";
import Dashboard from "./pages/organizer/Dashboard";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Guest */}
        <Route element={<GuestLayout />}>
          <Route path="/" element={<Explore />} />
          <Route path="/event" element={<Event />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/communities" element={<Communities />} />
        </Route>

        {/* Attende */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AttendeeLayout />}>
            <Route path="/myevents" element={<MyEvents />} />
            <Route path="/event/:id" element={<EventDetail />} />
            <Route path="/communities/:id" element={<CommunityDetail />} />
            <Route path="/profile" element={<MyProfile />} />
            <Route path="/notification" element={<Notification />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Route>

        {/* Auth*/}
        <Route element={<AuthLayout />}>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/forgot-password-success"
            element={<ForgotPasswordSuccess />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
