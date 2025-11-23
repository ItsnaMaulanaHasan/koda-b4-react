import { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { clearDataProfile } from "../redux/reducers/profile";
import Alert from "./Alert";
import ModalConfirmation from "./ModalConfirmation";

function SidebarAdmin({ children }) {
  const [showModal, setShowModal] = useState(false);
  const [alertStatus, setAlertStatus] = useState({ type: "", message: "" });
  const { accessToken, setAccessToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      const res = await fetch(
        import.meta.env.VITE_BASE_URL + "/logout",
        accessToken
      );

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.message || "Failed to logout");
      }

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      setAccessToken("");
      dispatch(clearDataProfile());
      navigate("/auth/login");
    } catch (error) {
      let errorMessage = "Failed to logout";
      if (error.message) {
        errorMessage = error.message;
      } else if (!navigator.onLine) {
        errorMessage = "No internet connection";
      }
      setAlertStatus({
        type: "error",
        message: errorMessage,
      });
    }
  };

  const getNavLinkClass = ({ isActive }) =>
    `w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium ${
      isActive ? "bg-[#FF8906] text-[#0B132A]" : "text-[#4F5665]"
    }`;
  return (
    <div className="min-h-screen bg-gray-50">
      <Alert
        type={alertStatus.type}
        message={alertStatus.message}
        onClose={() => setAlertStatus({ type: "", message: "" })}
      />
      <ModalConfirmation
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
        type="warning"
      />
      <aside className="fixed left-0 w-56 h-screen bg-white border-r border-gray-200 top-20">
        <div className="p-4">
          <nav className="space-y-2">
            <NavLink to="/admin/dashboard" className={getNavLinkClass}>
              <img
                className="size-5"
                src="/icon/icon-dashboard.svg"
                alt="Icon Dashboard"
              />
              Dashboard
            </NavLink>
            <NavLink to="/admin/product" className={getNavLinkClass}>
              <img
                className="size-5"
                src="/icon/icon-glass.svg"
                alt="Icon Product"
              />
              Product
            </NavLink>
            <NavLink to="/admin/order" className={getNavLinkClass}>
              <img
                className="size-5"
                src="/icon/icon-bag.svg"
                alt="Icon Order"
              />
              Order
            </NavLink>
            <NavLink to="/admin/users" className={getNavLinkClass}>
              <img
                className="size-5"
                src="/icon/icon-users.svg"
                alt="Icon Users"
              />
              User
            </NavLink>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center w-full gap-3 px-4 py-3 font-medium text-gray-700 rounded-lg hover:bg-gray-100">
              <img
                className="size-5"
                src="/icon/icon-logout.svg"
                alt="Icon Logout"
              />
              Keluar
            </button>
          </nav>
        </div>
      </aside>
      <main className="p-8 mt-20 ml-56">{children}</main>
    </div>
  );
}

export default SidebarAdmin;
