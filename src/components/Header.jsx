import { Link, useNavigate, NavLink } from "react-router";
import { FiBell, FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";
import MobileMenu from "./MobileMenu";
import { RxDashboard } from "react-icons/rx";
import { FiShield } from "react-icons/fi";
import ModalLogout from "./ModalLogout";
import ThemeToggle from "./ThemeToggle";

//redux
import { useAppSelector, useAppDispatch } from "../hooks/reduxHooks";
import { logout } from "../redux/slice/authSlice";

function Header() {
  const navigate = useNavigate();

  //logoutmodal
  const [logoutModal, setLogoutModal] = useState(false);

  //mobile
  const [isOpen, setIsOpen] = useState(false);
  //profile
  const [profileOpen, setProfileOpen] = useState(false);

  //redux
  const currentUser = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  function handleLogout() {
    dispatch(logout());

    setIsOpen(false);

    navigate("/signin");
  }

  return (
    <>
      <header className=" sticky top-0 z-50 flex items-center justify-between border-b border-b-gray-secondary/20 bg-white px-3 py-2 shadow-md md:px-6 md:py-3 transition-colors duration-300 dark:border-zinc-700 dark:bg-zinc-900">
        <div className="flex flex-row items-center gap-5">
          {/* Logo */}
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

          {/* DESKTOP NAVIGATION */}
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

              {/* ATTENDEE ONLY */}
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

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">
          {/* DESKTOP */}

          <div>
            {currentUser?.role === "organizer" && (
              <Link
                to="/dashboard"
                className="flex flex-row items-center gap-1 bg-orange-secondary px-3.5 py-2 text-orange-primary rounded-lg "
              >
                <RxDashboard />
                Dashboard
              </Link>
            )}
            {currentUser?.role === "admin" && (
              <Link
                to="/admin"
                className="flex flex-row items-center gap-1 bg-orange-secondary px-3.5 py-2 text-orange-primary  rounded-lg "
              >
                <FiShield />
                Admin
              </Link>
            )}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {!currentUser ? (
              <>
                {/* GUEST */}
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
                {/* ATTENDEE */}
                <NavLink
                  to="/notification"
                  aria-label="Open notifications"
                  className={({ isActive }) =>
                    `relative p-2 rounded-lg ${isActive ? "text-orange-primary bg-orange-primary/20 " : "text-gray-secondary hover:bg-gray-100 dark:hover:bg-zinc-800"}`
                  }
                >
                  {({ isActive }) => (
                    <FiBell
                      className={`h-5 w-5 ${isActive ? "text-orange-primary" : ""}`}
                    />
                  )}
                </NavLink>

                <ThemeToggle />

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setProfileOpen((prev) => !prev)}
                    className="flex items-center"
                  >
                    <img
                      src={currentUser.image || "/Default-Avatar.svg"}
                      alt={currentUser.name || "User"}
                      className="h-7 w-7 rounded-full object-cover border"
                    />
                  </button>

                  {profileOpen && (
                    <div className=" absolute right-0 mt-3 w-64 rounded-xl bg-white shadow-lg border border-gray-100 overflow-hidden dark:border-zinc-700 dark:bg-zinc-900">
                      <div className="px-5 py-4 border-b border-gray-200 dark:border-zinc-700">
                        {/* Nama user */}
                        <p className="font-semibold text-gray-800 dark:text-white">
                          {currentUser.name || "User"}
                        </p>

                        {/* Email user */}
                        <p className="text-sm text-gray-400">
                          {currentUser.email}
                        </p>
                      </div>

                      <Link
                        to="/profile"
                        // klik profile dropdown ditutup
                        onClick={() => setProfileOpen(false)}
                        className="block px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 dark:text-zinc-200 dark:hover:bg-zinc-800"
                      >
                        My Profile
                      </Link>

                      <button
                        type="button"
                        onClick={() => setLogoutModal(true)}
                        className=" w-full text-left px-5 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 "
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* MOBILE */}

          <div className="flex items-center gap-3 md:hidden">
            {/* Bell hanya Attendee */}
            {currentUser && (
              <NavLink
                to="/notification"
                aria-label="Open notifications"
                className="text-gray-primary dark:text-zinc-300"
              >
                <FiBell className="h-5 w-5" />
              </NavLink>
            )}

            {/* Dark mode */}
            <ThemeToggle />

            {/* Hamburger */}
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-secondary hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800"
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

        {/* MOBILE MENU */}
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
