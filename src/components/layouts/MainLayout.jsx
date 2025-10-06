import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";

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
