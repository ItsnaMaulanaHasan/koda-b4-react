import { useContext, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { DrawerNavbarContext } from "../context/DrawerContext";
import Button from "./Button";
import Drawer from "./Drawer";
import Input from "./Input";

/**
 * Navbar component for site navigation with authentication buttons
 * @returns {JSX.Element} Navbar component with logo, navigation links, search, cart, and auth buttons
 */
function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDrawer, setShowDrawer] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
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
            <button className="flex-shrink-0 w-5 h-5 cursor-pointer lg:h-6 lg:w-6">
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
                      className="object-cover w-full h-full"
                      src={userLogin.profileImage || "/img-menus/image1.png"}
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
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
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
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-gray-100 transition">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button
                  onClick={() => navigate("/auth/login")}
                  className="px-3 text-sm text-whitel border border-white lg:px-4 whitespace-nowrap lg:text-base">
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
              <img
                src="/public/icon/icon-hamburger-menu.svg"
                alt="Hamburger Menu"
              />
            </button>
          </div>
        </nav>
        <Drawer
          drawerCtx={{ showDrawer, setShowDrawer }}
          bg="bg-white"
          textColor="text-[#0B132A]">
          <Sidebar userLogin={userLogin} handleLogout={handleLogout} />
        </Drawer>
      </header>
    </DrawerNavbarContext.Provider>
  );
}

const Sidebar = ({ userLogin, handleLogout }) => {
  const navigate = useNavigate();
  const { setShowDrawer } = useContext(DrawerNavbarContext);
  const getNavLinkClass = ({ isActive }) =>
    `hover:font-bold w-full py-3 transition duration-300 border-b ${
      isActive ? "border-b-[#FF8906]" : "border-b-[#E8E8E8]"
    }`;

  const handleNavigation = (path) => {
    navigate(path);
    setShowDrawer(false);
  };
  return (
    <div className="flex flex-col justify-between h-full px-2">
      <div className="flex flex-col w-full gap-5">
        <div className="flex items-center justify-between">
          <img src="/public/icon/logo-original.svg" alt="Logo HIFI" />
          <button
            onClick={() => setShowDrawer(false)}
            className="text-xs font-bold text-red-500 border-2 border-red-500 rounded-full size-5">
            ✕
          </button>
        </div>
        <Input
          id="search"
          type="search"
          label="Search Product"
          placeholder="Find Product"
        />
        <ul className="flex flex-col w-full items-center gap-3 text-sm text-[#0B132A] lg:gap-10 lg:text-base">
          <NavLink to="/" className={getNavLinkClass}>
            <li>Home</li>
          </NavLink>
          <NavLink to="/product" className={getNavLinkClass}>
            <li>Product</li>
          </NavLink>
        </ul>
      </div>

      <div className="flex flex-col gap-5">
        {userLogin ? (
          <>
            <div className="flex items-center gap-3 p-3 border border-[#E8E8E8] rounded-lg">
              <div className="w-12 h-12 overflow-hidden rounded-full flex-shrink-0">
                <img
                  className="object-cover w-full h-full"
                  src={userLogin.profileImage || "/img-menus/image1.png"}
                  alt="Profile"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#0B132A] truncate">
                  {userLogin.fullName}
                </p>
                <p className="text-xs text-[#4F5665] truncate">
                  {userLogin.email}
                </p>
              </div>
            </div>
            <Button
              onClick={() => handleNavigation("/profile")}
              className="px-3 text-sm border border-[#0B132A] text-[#0B132A] lg:px-4 whitespace-nowrap lg:text-base">
              Profile
            </Button>
            <Button
              onClick={() => {
                handleLogout();
                setShowDrawer(false);
              }}
              className="px-3 lg:px-4 bg-red-500 text-white whitespace-nowrap text-sm lg:text-base">
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => handleNavigation("/auth/login")}
              className="px-3 text-sm text-[#0B132A] border border-[#0B132A] lg:px-4 whitespace-nowrap lg:text-base">
              Sign In
            </Button>
            <Button
              onClick={() => handleNavigation("/auth/register")}
              className="px-3 lg:px-4 bg-[#FF8906] whitespace-nowrap text-sm lg:text-base">
              Sign Up
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
