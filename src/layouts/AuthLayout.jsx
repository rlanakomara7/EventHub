import AuthSidebar from "../components/AuthSidebar";
import { Outlet } from "react-router";

function AuthLayout() {
  return (
    <main className="grid min-h-screen md:flex md:grid-cols-2">
      <div className="hidden md:block grid-rows-2 w-[40%]">
        <AuthSidebar />
      </div>

      <section className="flex items-center justify-center w-[60%] bg-white">
        <Outlet />
      </section>
    </main>
  );
}

export default AuthLayout;
