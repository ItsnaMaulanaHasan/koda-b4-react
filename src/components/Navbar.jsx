import { useContext, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { DrawerNavbarContext } from "../context/DrawerContext";
import Button from "./Button";
import Drawer from "./Drawer";
import ModalConfirmation from "./ModalConfirmation";
import SearchDesktopDropdown from "./SearchDesktopDropdown";
import SidebarMobile from "./SidebarMobile";

/**
 * Navbar component for site navigation with authentication buttons
 * @returns {JSX.Element} Navbar component with logo, navigation links, search, cart, and auth buttons
 */
function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearchDesktop, setShowSearchDesktop] = useState(false);
  const { userLogin, setUserLogin } = useContext(AuthContext);

  const isHomePage = location.pathname === "/";
  const isAdminPage = location.pathname.startsWith("/admin");

  const getNavLinkClass = ({ isActive }) =>
    `hover:font-bold py-1 transition duration-300 ${
      isActive && "font-bold border-b border-[#FF8906]"
    }`;

  const handleLogout = () => {
    setUserLogin(null);
    setShowDropdown(false);
    navigate("/auth/login");
  };

  const navbarBgClass = isAdminPage
    ? "bg-white"
    : isHomePage
    ? "bg-[#0B090921]"
    : "bg-[#0B0909]";

  const navTextColor = isAdminPage ? "text-[#0B132A]" : "text-white";

  return (
    <DrawerNavbarContext.Provider value={{ showDrawer, setShowDrawer }}>
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
      <header>
        <nav
          className={`flex w-full fixed top-0 justify-between items-center px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40 z-200 py-4 sm:py-5 ${navbarBgClass} ${
            isAdminPage && "border-b border-b-[#E8E8E8]"
          }`}>
          <div className="flex items-center gap-4 sm:gap-5 md:gap-7 lg:gap-10">
            <div className="flex-shrink-0">
              <img
                className="w-auto h-6 sm:h-7 md:h-8"
                src={
                  isAdminPage
                    ? "/icon/logo-original.svg"
                    : "/icon/logo-white.svg"
                }
                alt="Logo white"
              />
            </div>
            {!isAdminPage && (
              <div className="hidden md:block">
                <ul
                  className={`flex items-center gap-6 text-sm lg:gap-10 lg:text-base ${navTextColor}`}>
                  <NavLink to="/" className={getNavLinkClass}>
                    <li>Home</li>
                  </NavLink>
                  <NavLink to="/product" className={getNavLinkClass}>
                    <li>Product</li>
                  </NavLink>
                </ul>
              </div>
            )}
          </div>

          {/* Desktop Menu */}
          <div className="items-center hidden gap-3 md:flex lg:gap-5">
            <div className="relative">
              <button
                onClick={() => setShowSearchDesktop(!showSearchDesktop)}
                className="flex-shrink-0 w-5 h-5 cursor-pointer lg:h-6 lg:w-6">
                <img
                  className="w-full h-full"
                  src={
                    isAdminPage
                      ? "/icon/icon-search-black.svg"
                      : "/icon/icon-search.svg"
                  }
                  alt="Icon Search"
                />
              </button>

              {/* Search Dropdown */}
              {showSearchDesktop && (
                <SearchDesktopDropdown
                  setShowSearchDesktop={setShowSearchDesktop}
                />
              )}
            </div>
            <button
              onClick={() => navigate("/cart")}
              className="flex-shrink-0 w-5 h-5 cursor-pointer lg:h-6 lg:w-6">
              <img
                className="w-full h-full"
                src={
                  isAdminPage
                    ? "/icon/icon-cart-black.svg"
                    : "/icon/icon-cart.svg"
                }
                alt="Icon Cart"
              />
            </button>

            {userLogin ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 lg:gap-3">
                  <div className="w-8 h-8 overflow-hidden rounded-full lg:w-10 lg:h-10">
                    <img
                      className="object-contain w-full h-full"
                      src={
                        userLogin.profileImage ||
                        "/img/empty-photo-profile.jpeg"
                      }
                      alt="Profile"
                    />
                  </div>
                  <svg
                    className={`w-4 h-4 ${navTextColor} transition-transform ${
                      showDropdown ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 z-50 w-48 py-2 mt-2 bg-white rounded-lg shadow-lg">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-semibold text-[#0B132A]">
                        {userLogin.fullName}
                      </p>
                      <p className="text-xs text-[#4F5665]">
                        {userLogin.email}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setShowDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-[#0B132A] hover:bg-gray-100 transition">
                      Profile
                    </button>
                    <button
                      onClick={() => setShowModal(true)}
                      className="w-full px-4 py-2 text-sm text-left text-red-500 transition hover:bg-gray-100">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button
                  onClick={() => navigate("/auth/login")}
                  className="px-3 text-sm border border-white text-whitel lg:px-4 whitespace-nowrap lg:text-base">
                  Sign In
                </Button>
                <Button
                  onClick={() => navigate("/auth/register")}
                  className="px-3 lg:px-4 bg-[#FF8906] whitespace-nowrap text-sm lg:text-base">
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu - Cart & Hamburger */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => navigate("/cart")}
              className="flex-shrink-0 w-5 h-5 cursor-pointer">
              <img
                className="w-full h-full"
                src="/icon/icon-cart.svg"
                alt="Icon Cart"
              />
            </button>

            {/* Hamburger Button */}
            <button
              onClick={() => setShowDrawer(!showDrawer)}
              className="flex flex-col items-center justify-center w-6 h-6 gap-1 cursor-pointer">
              <img src="/icon/icon-hamburger-menu.svg" alt="Hamburger Menu" />
            </button>
          </div>
        </nav>
        <Drawer
          drawerCtx={{ showDrawer, setShowDrawer }}
          bg="bg-white"
          textColor="text-[#0B132A]">
          <SidebarMobile
            userLogin={userLogin}
            handleLogout={() => setShowModal(true)}
          />
        </Drawer>
      </header>
    </DrawerNavbarContext.Provider>
  );
}

export default Navbar;
