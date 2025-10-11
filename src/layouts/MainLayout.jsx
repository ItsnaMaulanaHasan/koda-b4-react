import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ProtectedRoute from "../context/ProtectedRoute";

function MainLayout() {
  return (
    <>
      <Navbar />
      <ProtectedRoute>
        <main>
          <Outlet />
        </main>
      </ProtectedRoute>
      <Footer />
    </>
  );
}

export default MainLayout;
