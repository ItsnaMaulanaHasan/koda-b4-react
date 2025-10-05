import Footer from "../Footer";
import Navbar from "../Navbar";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-350px)]">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default MainLayout;
