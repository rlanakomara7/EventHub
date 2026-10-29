import { NavLink } from "react-router";

function MobileMenu({ currentUser, onClose, onLogout }) {
  const linkClass = ({ isActive }) =>
    `block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
      isActive
        ? "bg-orange-primary/10 text-orange-primary"
        : "text-zinc-800 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
    }`;

  return (
    <div className="absolute top-full right-3 z-100 w-64 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-xl border border-zinc-200 bg-white p-3 text-zinc-900 shadow-xl dark:border-zinc-700 dark:bg-zinc-900 dark:text-white md:hidden">
      {currentUser ? (
        <div className="mb-3 border-b border-zinc-200 px-3 pb-3 dark:border-zinc-700">
          <p className="truncate font-semibold text-zinc-900 dark:text-white">
            {currentUser.name || "User"}
          </p>

          <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
            {currentUser.email || ""}
          </p>
        </div>
      ) : (
        <p className="mb-3 border-b border-zinc-200 px-3 pb-3 text-xs text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
          Browsing as guest
        </p>
      )}

      <nav className="flex flex-col gap-1">
        <NavLink to="/explore" onClick={onClose} className={linkClass}>
          Explore
        </NavLink>

        <NavLink to="/event" onClick={onClose} className={linkClass}>
          Events
        </NavLink>

        <NavLink to="/communities" onClick={onClose} className={linkClass}>
          Communities
        </NavLink>

        {currentUser?.role === "attendee" && (
          <>
            <NavLink to="/myevents" onClick={onClose} className={linkClass}>
              My Events
            </NavLink>

            <NavLink to="/profile" onClick={onClose} className={linkClass}>
              My Profile
            </NavLink>
          </>
        )}
      </nav>

      <div className="mt-3 border-t border-zinc-200 pt-3 dark:border-zinc-700">
        {currentUser ? (
          <button
            type="button"
            onClick={onLogout}
            className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            Sign Out
          </button>
        ) : (
          <NavLink
            to="/signin"
            onClick={onClose}
            className="block rounded-lg px-3 py-2.5 text-sm font-medium text-orange-primary hover:bg-orange-primary/10"
          >
            Sign In
          </NavLink>
        )}
      </div>
    </div>
  );
}

export default MobileMenu;
