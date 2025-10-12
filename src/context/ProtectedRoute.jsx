import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

function ProtectedRoute({
  children,
  redirectIfAuthenticated = false,
  allowedRole = null,
}) {
  const { userLogin } = useContext(AuthContext);
  const isAuthenticated = !!userLogin?.email;

  if (redirectIfAuthenticated) {
    if (isAuthenticated) {
      if (userLogin.role === "admin") {
        return <Navigate to="/admin/dashboard" replace />;
      }
      return <Navigate to="/" replace />;
    }
    return children;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (allowedRole && userLogin.role !== allowedRole) {
    if (userLogin.role === "customer") {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
