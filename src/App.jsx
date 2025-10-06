import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import DetailProduct from "./pages/DetailProduct";
import RegisterPage from "./pages/RegisterPage";
import ProductPage from "./pages/ProductPage";
import HistoryPage from "./pages/HistoryPage";
import MainLayout from "./components/layouts/MainLayout";
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
    ],
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
