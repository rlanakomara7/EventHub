import { BrowserRouter, Routes, Route } from "react-router";

// Layout
import GuestLayout from "./layouts/GuestLayout";
import AuthLayout from "./layouts/AuthLayout";
import AttendeeLayout from "./layouts/AttendeeLayout";

// Guest pages
import Event from "./pages/guest/Event";
import Explore from "./pages/guest/Explore";
import Communities from "./pages/guest/Communities";

// Attendee pages
import ProtectedRoute from "./ProtectedRoute";
import MyEvents from "./pages/attendee/MyEvents";
import EventDetail from "./pages/attendee/EventDetail";
import CommunityDetail from "./pages/attendee/CommunityDetail";
import MyProfile from "./pages/attendee/MyProfile";
import Notification from "./pages/attendee/Notification";

// Organizer pages
import Dashboard from "./pages/organizer/Dashboard";
import CreateEvent from "./pages/organizer/CreateEvent";
import EditEvent from "./pages/organizer/EditEvent";

// Auth pages
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ForgotPasswordSuccess from "./pages/auth/ForgotPasswordSuccess";
import InsertNewPassword from "./pages/auth/InsertNewPassword";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminCommunities from "./pages/admin/AdminCommunities";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* GUEST ROUTES */}
        <Route element={<GuestLayout />}>
          <Route path="/" element={<Explore />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/event" element={<Event />} />
          <Route path="/communities" element={<Communities />} />
        </Route>

        {/* PROTECTED ROUTES */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AttendeeLayout />}>
            <Route path="/myevents" element={<MyEvents />} />
            <Route path="/event/:id" element={<EventDetail />} />
            <Route path="/communities/:id" element={<CommunityDetail />} />
            <Route path="/profile" element={<MyProfile />} />
            <Route path="/notification" element={<Notification />} />

            {/* ORGANIZER ROUTES */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/events/new" element={<CreateEvent />} />
            <Route path="/dashboard/events/:id/edit" element={<EditEvent />} />
            {/* ADMIN ROUTES */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/events" element={<AdminEvents />} />
            <Route path="/admin/communities" element={<AdminCommunities />} />
          </Route>
        </Route>

        {/* AUTH ROUTES */}
        <Route element={<AuthLayout />}>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/forgot-password-success"
            element={<ForgotPasswordSuccess />}
          />
          <Route path="/insert-password" element={<InsertNewPassword />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
