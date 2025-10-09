import { Outlet } from "react-router-dom";
import ProtectedRoute from "../context/ProtectedRoute";

function AuthLayout() {
  return (
    <ProtectedRoute redirectIfAuthenticated={true}>
      <Outlet />
    </ProtectedRoute>
  );
}

export default AuthLayout;
