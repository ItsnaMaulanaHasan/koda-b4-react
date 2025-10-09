import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useEffect, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import DetailProduct from "./pages/DetailProduct";
import DetailHistory from "./pages/DetailHistory";
import RegisterPage from "./pages/RegisterPage";
import ProductPage from "./pages/ProductPage";
import HistoryPage from "./pages/HistoryPage";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "/product",
        element: <ProductPage />,
      },
      {
        path: "/product/:id",
        element: <DetailProduct />,
      },
      {
        path: "/cart",
        element: <CartPage />,
      },
      {
        path: "/order-history",
        element: <HistoryPage />,
      },
      {
        path: "/order-history/:noOrder",
        element: <DetailHistory />,
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/auth/register",
        element: <RegisterPage />,
      },
      {
        path: "/auth/login",
        element: <LoginPage />,
      },
      {
        path: "/auth/forgot-password",
        element: <ForgotPasswordPage />,
      },
    ],
  },
]);

function App() {
  const [userLogin, setUserLogin] = useState(() => {
    try {
      const data = window.localStorage.getItem("userLogin");
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.log("Failed to parse tasks from localStorage:", error);
      return null;
    }
  });
  useEffect(() => {
    window.localStorage.setItem("userLogin", JSON.stringify(userLogin));
  }, [userLogin]);
  return (
    <AuthContext.Provider value={{ userLogin, setUserLogin }}>
      <RouterProvider router={router} />;
    </AuthContext.Provider>
  );
}

export default App;
