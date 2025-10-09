import { Outlet } from "react-router-dom";
import ProtectedRoute from "../context/ProtectedRoute";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MainLayout() {
  return (
    <>
      <Navbar />
      <ProtectedRoute>
        <main className="min-h-[calc(100vh-350px)]">
          <Outlet />
        </main>
      </ProtectedRoute>
      <Footer />
    </>
  );
}

export default MainLayout;
