import { Link, useNavigate, NavLink } from "react-router";
import { FiBell, FiMenu, FiX, FiShield } from "react-icons/fi";
import { RxDashboard } from "react-icons/rx";
import { useState } from "react";

import MobileMenu from "./MobileMenu";
import ModalLogout from "./ModalLogout";
import ThemeToggle from "./ThemeToggle";

import { useAppSelector, useAppDispatch } from "../hooks/reduxHooks";
import { logout } from "../redux/slice/authSlice";
import { logoutUser } from "../services/authService";
import { getAvatarUrl } from "../services/profileService";

function Header() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector((state) => state.auth.user);

  const [logoutModal, setLogoutModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  async function handleLogout() {
    try {
      await logoutUser();

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      dispatch(logout());

      setLogoutModal(false);
      setProfileOpen(false);
      setIsOpen(false);

      navigate("/signin");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-b-gray-secondary/20 bg-white px-3 py-2 shadow-md transition-colors duration-300 md:px-6 md:py-3 dark:border-zinc-700 dark:bg-zinc-900">
        <div className="flex flex-row items-center gap-5">
          <Link
            to="/"
            className="flex flex-row items-center gap-2"
            onClick={() => setIsOpen(false)}
          >
            <p className="rounded-xl bg-orange-primary px-3 py-1.5 text-white-primary md:px-4 md:py-2">
              E
            </p>

            <p className="font-bold text-black-primary dark:text-white">
              EventHub
            </p>
          </Link>

          <nav className="hidden text-sm font-medium md:block">
            <div className="flex items-center gap-3">
              <NavLink
                to="/explore"
                className={({ isActive }) =>
                  isActive
                    ? "rounded-xl bg-orange-secondary px-3.5 py-2 text-orange-primary"
                    : "px-3.5 py-2 text-gray-secondary hover:text-black-primary dark:hover:text-white"
                }
              >
                Explore
              </NavLink>

              <NavLink
                to="/event"
                className={({ isActive }) =>
                  isActive
                    ? "rounded-xl bg-orange-secondary px-3.5 py-2 text-orange-primary"
                    : "px-3.5 py-2 text-gray-secondary"
                }
              >
                Events
              </NavLink>

              <NavLink
                to="/communities"
                className={({ isActive }) =>
                  isActive
                    ? "rounded-xl bg-orange-secondary px-3.5 py-2 text-orange-primary"
                    : "px-3.5 py-2 text-gray-secondary hover:text-black-primary dark:hover:text-white"
                }
              >
                Communities
              </NavLink>

              {currentUser?.role === "attendee" && (
                <NavLink
                  to="/myevents"
                  className={({ isActive }) =>
                    isActive
                      ? "rounded-xl bg-orange-secondary px-3.5 py-2 text-orange-primary"
                      : "px-3.5 py-2 text-gray-secondary hover:text-black-primary dark:hover:text-white"
                  }
                >
                  My Events
                </NavLink>
              )}
            </div>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div>
            {currentUser?.role === "organizer" && (
              <Link
                to="/dashboard"
                className="flex flex-row items-center gap-1 rounded-lg bg-orange-secondary px-3.5 py-2 text-orange-primary"
              >
                <RxDashboard />
                Dashboard
              </Link>
            )}

            {currentUser?.role === "admin" && (
              <Link
                to="/admin"
                className="flex flex-row items-center gap-1 rounded-lg bg-orange-secondary px-3.5 py-2 text-orange-primary"
              >
                <FiShield />
                Admin
              </Link>
            )}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {!currentUser ? (
              <>
                <p className="text-xs text-gray-secondary">Browsing as guest</p>

                <ThemeToggle />

                <Link
                  to="/signin"
                  className="rounded-xl bg-orange-primary px-5 py-2 text-sm text-white-primary"
                >
                  Sign In
                </Link>
              </>
            ) : (
              <>
                <NavLink
                  to="/notification"
                  aria-label="Open notifications"
                  className={({ isActive }) =>
                    `relative rounded-lg p-2 ${
                      isActive
                        ? "bg-orange-primary/20 text-orange-primary"
                        : "text-gray-secondary hover:bg-gray-100 dark:hover:bg-zinc-800"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <FiBell
                      className={`h-5 w-5 ${
                        isActive ? "text-orange-primary" : ""
                      }`}
                    />
                  )}
                </NavLink>

                <ThemeToggle />

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setProfileOpen((prev) => !prev)}
                    className="flex items-center"
                    aria-label="Open profile menu"
                  >
                    <img
                      src={getAvatarUrl(currentUser?.avatar)}
                      alt={currentUser?.name || "User"}
                      className="h-7 w-7 rounded-full border object-cover"
                    />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
                      <div className="border-b border-gray-200 px-5 py-4 dark:border-zinc-700">
                        <p className="font-semibold text-gray-800 dark:text-white">
                          {currentUser.name || "User"}
                        </p>

                        <p className="text-sm text-gray-400">
                          {currentUser.email}
                        </p>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="block px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 dark:text-zinc-200 dark:hover:bg-zinc-800"
                      >
                        My Profile
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setProfileOpen(false);
                          setLogoutModal(true);
                        }}
                        className="w-full px-5 py-3 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 md:hidden">
            {currentUser && (
              <NavLink
                to="/notification"
                aria-label="Open notifications"
                className="text-gray-primary dark:text-zinc-300"
              >
                <FiBell className="h-5 w-5" />
              </NavLink>
            )}

            <ThemeToggle />

            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-secondary hover:bg-gray-100 dark:hover:bg-zinc-800"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <FiX className="h-5 w-5" />
              ) : (
                <FiMenu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {isOpen && (
          <MobileMenu
            currentUser={currentUser}
            onClose={() => setIsOpen(false)}
            onLogout={handleLogout}
          />
        )}
      </header>

      {logoutModal && (
        <ModalLogout
          onCancel={() => setLogoutModal(false)}
          onConfirm={handleLogout}
        />
      )}
    </>
  );
}

export default Header;
