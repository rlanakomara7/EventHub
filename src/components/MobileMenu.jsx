import { NavLink } from "react-router";

function MobileMenu({ currentUser, onClose, onLogout }) {
  return (
    <div className="absolute top-full right-3 z-[100] w-64 rounded-xl bg-white p-4 shadow-xl md:hidden">
      {currentUser ? (
        <div className="mb-3 border-b pb-3">
          <p className="font-semibold">{currentUser.name || "User"}</p>

          <p className="text-xs text-gray-400">{currentUser.email || ""}</p>
        </div>
      ) : (
        <p className="mb-3 border-b pb-3 text-xs text-gray-secondary">
          Browsing as guest
        </p>
      )}

      <nav className="flex flex-col gap-1">
        <NavLink
          to="/explore"
          onClick={onClose}
          className="rounded-lg px-3 py-2 hover:bg-gray-100"
        >
          Explore
        </NavLink>

        <NavLink
          to="/event"
          onClick={onClose}
          className="rounded-lg px-3 py-2 hover:bg-gray-100"
        >
          Events
        </NavLink>

        <NavLink
          to="/communities"
          onClick={onClose}
          className="rounded-lg px-3 py-2 hover:bg-gray-100"
        >
          Communities
        </NavLink>

        {currentUser?.role === "attendee" && (
          <>
            <NavLink
              to="/myevents"
              onClick={onClose}
              className="rounded-lg px-3 py-2 hover:bg-gray-100"
            >
              My Events
            </NavLink>

            <NavLink
              to="/profile"
              onClick={onClose}
              className="rounded-lg px-3 py-2 hover:bg-gray-100"
            >
              My Profile
            </NavLink>
          </>
        )}
      </nav>

      <div className="mt-2 border-t pt-2">
        {currentUser ? (
          <button
            type="button"
            onClick={onLogout}
            className="w-full rounded-lg px-3 py-2 text-left font-medium text-red-500 hover:bg-red-50"
          >
            Sign Out
          </button>
        ) : (
          <NavLink
            to="/signin"
            onClick={onClose}
            className="block rounded-lg px-3 py-2 font-medium text-red-500 hover:bg-red-50"
          >
            Sign In
          </NavLink>
        )}
      </div>
    </div>
  );
}

export default MobileMenu;
