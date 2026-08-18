import { Link, useNavigate, NavLink } from "react-router";
import { FiBell } from "react-icons/fi";

function Header() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  //handle logout
  function handleLogout() {
    localStorage.removeItem("currentUser");
    navigate("/signin");
  }
  return (
    <>
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-b-gray-secondary bg-white px-3 py-2 md:px-6 md:py-3">
        <div className="flex flex-row gap-5">
          <div className="flex flex-row items-center gap-2">
            <p className="bg-orange-primary py-1.5 px-3 md:py-2 md:px-4 rounded-xl text-white-primary">
              E
            </p>
            <p className="font-bold">EventHub</p>
          </div>

          <nav className="text-s font-medium hidden md:block">
            <div className="flex gap-3 items-center">
              <NavLink
                to="/explore"
                className={({ isActive }) =>
                  isActive
                    ? "bg-orange-secondary py-2 px-3.5 rounded-xl text-orange-primary"
                    : "text-gray-secondary py-2 px-3.5"
                }
              >
                Explore
              </NavLink>

              <NavLink
                to="/event"
                className={({ isActive }) =>
                  isActive
                    ? "bg-orange-secondary py-2 px-3.5 rounded-xl text-orange-primary"
                    : "text-gray-secondary py-2 px-3.5"
                }
              >
                Events
              </NavLink>

              <NavLink
                to="/communities"
                className={({ isActive }) =>
                  isActive
                    ? "bg-orange-secondary py-2 px-3.5 rounded-xl text-orange-primary"
                    : "text-gray-secondary py-2 px-3.5"
                }
              >
                Communities
              </NavLink>

              {currentUser && (
                <NavLink
                  to="/myevents"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-orange-secondary py-2 px-3.5 rounded-xl text-orange-primary"
                      : "text-gray-secondary py-2 px-3.5"
                  }
                >
                  My Events
                </NavLink>
              )}
            </div>
          </nav>
        </div>

        <div className="flex flex-row gap-3 items-center">
          {/* kondisi belum / sudah signin */}
          {!currentUser ? (
            <>
              <p className="text-gray-secondary text-xs">Browsing as guest</p>
              <img src="/moon-svgrepo-com.svg" alt="Moon" className="w-5" />
              <Link
                className="bg-orange-primary text-white-primary text-fourty py-2 px-5 rounded-xl"
                to="/signin"
              >
                Sign In
              </Link>
            </>
          ) : (
            <>
              <FiBell className="w-5 h-5 text-gray-secondary" />

              <img src="/moon-svgrepo-com.svg" alt="Moon" className="w-5" />
              <img
                src={currentUser.image || "/Default-Avatar.svg"}
                alt={currentUser.name}
                className="h-8 w-8 rounded-full object-cover"
              />
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm text-red-500 font-bold"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </header>
    </>
  );
}

export default Header;
