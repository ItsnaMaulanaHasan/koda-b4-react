import { NavLink, useNavigate } from "react-router-dom";
import Button from "./Button";

function Navbar() {
  const navigate = useNavigate();

  const getNavLinkClass = ({ isActive }) => `hover:font-bold py-1 transition duration-300 ${isActive && "font-bold border-b border-[#FF8906]"}`;
  return (
    <header>
      <nav className="flex w-full fixed top-0 justify-between items-center px-4 sm:px-10 md:px-20 lg:px-40 z-100 py-5 bg-[#0B090921]">
        <div className="flex items-center gap-5 sm:gap-7 md:gap-10">
          <div>
            <img src="icon/logo-white.svg" alt="Logo white" />
          </div>
          <div>
            <ul className="flex items-center gap-10 text-white">
              <NavLink to="/" className={getNavLinkClass}>
                <li>Home</li>
              </NavLink>
              <NavLink to="/product" className={getNavLinkClass}>
                <li>Product</li>
              </NavLink>
            </ul>
          </div>
        </div>
        <div className="flex gap-5 items-center">
          <button className="h-6 w-6 flex-shrink-0 cursor-pointer">
            <img
              className="h-full w-full"
              src="icon/icon-search.svg"
              alt="Icon Search"
            />
          </button>
          <button className="h-6 w-6 flex-shrink-0 cursor-pointer">
            <img
              className="h-full w-full"
              src="icon/icon-cart.svg"
              alt="Icon Cart"
            />
          </button>
          <Button
            onCLick={() => navigate("/login")}
            className="border border-white px-4 text-white whitespace-nowrap"
          >
            Sign In
          </Button>
          <Button
            onCLick={() => navigate("/register")}
            className="px-4 bg-[#FF8906] whitespace-nowrap"
          >
            Sign Up
          </Button>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
