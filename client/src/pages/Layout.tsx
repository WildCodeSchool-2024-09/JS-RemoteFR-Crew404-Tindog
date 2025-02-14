import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

function Layout() {
  return (
    <section>
      <Navbar />
      <Outlet />
    </section>
  );
}

export default Layout;
