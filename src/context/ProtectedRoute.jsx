import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

function ProtectedRoute({
  children,
  redirectIfAuthenticated = false,
  allowedRole = null,
}) {
  const { accessToken } = useContext(AuthContext);
  const isAuthenticated = !!accessToken;

  const [userLogin, setUserLogin] = useState(null);
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!accessToken) {
        setUserLogin(null);
        return;
      }

      try {
        const res = await fetch(import.meta.env.VITE_BASE_URL + "/profiles", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const result = await res.json();

        if (!result.success) {
          throw new Error(result.error || result.message);
        }

        setUserLogin(result.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchUserProfile();
  }, [accessToken]);

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
