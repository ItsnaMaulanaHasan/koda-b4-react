import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProtectedRoute from "../context/ProtectedRoute";

function AdminLayout() {
  return (
    <>
      <ProtectedRoute allowedRole="admin">
        <Navbar />
        <Outlet />
      </ProtectedRoute>
    </>
  );
}

export default AdminLayout;
