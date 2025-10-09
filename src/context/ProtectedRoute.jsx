import { AuthContext } from "./AuthContext";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, redirectIfAuthenticated = false }) {
  const { userLogin } = useContext(AuthContext);
  const isAuthenticated = !!userLogin?.email;

  if (redirectIfAuthenticated) {
    return isAuthenticated ? <Navigate to="/" replace /> : children;
  } else {
    return isAuthenticated ? children : <Navigate to="/auth/login" replace />;
  }
}

export default ProtectedRoute;
