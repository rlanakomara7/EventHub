import { Link } from "react-router";

function Header() {
  return (
    <>
      <header className="">
        <div>
          <div className="flex flex-row gap-2">
            <p>E</p>
            <p>EventHub</p>
          </div>

          <nav>
            <div className="flex gap-2">
              <Link to="/Event">Events</Link>
              <Link>Communities</Link>
            </div>
          </nav>
        </div>
        <div>
          <p>Browsing as guest</p>
          <img src="/Event-Hub-Rama/public/moon-svgrepo-com.svg" alt="Moon" />
          <Link>Sign In</Link>
        </div>
      </header>
    </>
  );
}

export default Header;
