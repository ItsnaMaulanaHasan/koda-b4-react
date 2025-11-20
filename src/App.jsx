import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import Dashboard from "./admin-pages/Dashboard";
import OrderList from "./admin-pages/OrderList";
import ProductList from "./admin-pages/ProductList";
import UsersList from "./admin-pages/UsersList";
import { AuthContext } from "./context/AuthContext";
import ProtectedRoute from "./context/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import CartPage from "./pages/CartPage";
import DetailHistory from "./pages/DetailHistory";
import DetailProduct from "./pages/DetailProduct";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import HistoryPage from "./pages/HistoryPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProductPage from "./pages/ProductPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import { persistor, store } from "./redux/store";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
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
        element: (
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/order-history",
        element: (
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/order-history/:noOrder",
        element: (
          <ProtectedRoute>
            <DetailHistory />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: <NotFoundPage />,
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
    ],
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    element: <AdminLayout />,
    children: [
      {
        path: "/admin/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/admin/product",
        element: <ProductList />,
      },
      {
        path: "/admin/order",
        element: <OrderList />,
      },
      {
        path: "/admin/users",
        element: <UsersList />,
      },
      {
        path: "/admin/*",
        element: <NotFoundPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

function App() {
  const [accessToken, setAccessToken] = useState(() => {
    try {
      const data = window.localStorage.getItem("accessToken");
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.log("Failed to parse data user login from localStorage:", error);
      return null;
    }
  });
  useEffect(() => {
    window.localStorage.setItem("accessToken", JSON.stringify(accessToken));
  }, [accessToken]);
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <AuthContext.Provider value={{ accessToken, setAccessToken }}>
          <RouterProvider router={router} />
        </AuthContext.Provider>
      </PersistGate>
    </Provider>
  );
}

export default App;
