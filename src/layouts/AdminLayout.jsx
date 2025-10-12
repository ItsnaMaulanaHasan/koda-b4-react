import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import SidebarAdmin from "../components/SidebarAdmin";
import { DrawerAdminContext } from "../context/DrawerContext";
import ProtectedRoute from "../context/ProtectedRoute";

function AdminLayout() {
  const [showDrawer, setShowDrawer] = useState(false);
  return (
    <>
      <ProtectedRoute allowedRole="admin">
        <DrawerAdminContext.Provider value={{ showDrawer, setShowDrawer }}>
          <Navbar />
          <main>
            <SidebarAdmin>
              <Outlet />
            </SidebarAdmin>
          </main>
        </DrawerAdminContext.Provider>
      </ProtectedRoute>
    </>
  );
}

export default AdminLayout;
