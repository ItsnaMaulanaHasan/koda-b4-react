import { Outlet } from "react-router-dom";
import ProtectedRoute from "../context/ProtectedRoute";

function AuthLayout() {
  return (
    <ProtectedRoute redirectIfAuthenticated={true}>
      <main>
        <Outlet />
      </main>
    </ProtectedRoute>
  );
}

export default AuthLayout;
