import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "./hooks/reduxHooks";

function ProtectedRoute() {
  // const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  //redux
  const currentUser = useAppSelector((state) => state.auth.user);

  if (!currentUser) {
    return <Navigate to="/explore" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
