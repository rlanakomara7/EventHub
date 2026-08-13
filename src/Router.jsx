import { BrowserRouter, Routes, Route } from "react-router";
import Event from "./pages/guest/Event";
function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<Event />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
