
import { Outlet } from "react-router";
import Footer from "./Footer";
import Header from "./Header";

function Layout() {
  return (
  

    <div>
      <Header />
      <div className="container-fluid py-0 px-0 m-0 bg-light min-vh-100">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default Layout;