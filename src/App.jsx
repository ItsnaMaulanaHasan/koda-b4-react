import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { AuthContext } from "./context/AuthContext";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import CartPage from "./pages/CartPage";
import DetailHistory from "./pages/DetailHistory";
import DetailProduct from "./pages/DetailProduct";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import HistoryPage from "./pages/HistoryPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProductPage from "./pages/ProductPage";
import RegisterPage from "./pages/RegisterPage";
import { persistor, store } from "./redux/store";

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
      console.log("Failed to parse data user login from localStorage:", error);
      return null;
    }
  });
  useEffect(() => {
    window.localStorage.setItem("userLogin", JSON.stringify(userLogin));
  }, [userLogin]);
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <AuthContext.Provider value={{ userLogin, setUserLogin }}>
          <RouterProvider router={router} />;
        </AuthContext.Provider>
      </PersistGate>
    </Provider>
  );
}

export default App;
